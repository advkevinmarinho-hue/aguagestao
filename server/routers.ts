import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getMonthRange } from "../shared/business";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

const cents = z.number().int().min(0).max(100_000_000);
const requiredCents = z.number().int().min(1).max(100_000_000);
const exitModeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  priceCents: requiredCents,
  stockUnits: z.number().int().min(1).max(100),
  active: z.boolean().optional(),
});
const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80).default("Galões de água"),
  defaultPriceCents: requiredCents,
  unitCostCents: cents,
  stockUnits: z.number().int().min(0).max(1_000_000),
  minimumStockUnits: z.number().int().min(0).max(1_000_000),
  active: z.boolean().default(true),
  exitModes: z.array(exitModeSchema).max(12).default([]),
});

async function requireBusiness(userId: number) {
  const business = await db.getBusinessForUser(userId);
  if (!business) throw new TRPCError({ code: "NOT_FOUND", message: "Configure seu negócio para continuar." });
  return business;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  workspace: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const business = await db.getBusinessForUser(ctx.user.id);
      if (!business) return { business: null, workspace: null };
      const workspace = await db.getWorkspace(business.id);
      return { business, workspace };
    }),
    setup: protectedProcedure
      .input(z.object({ name: z.string().trim().min(2).max(120), monthlyGoalCents: cents, reserveGoalCents: cents }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getBusinessForUser(ctx.user.id);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Este usuário já possui um negócio configurado." });
        const businessId = await db.createBusiness({ userId: ctx.user.id, ...input });
        return { businessId };
      }),
    update: protectedProcedure
      .input(z.object({ name: z.string().trim().min(2).max(120), monthlyGoalCents: cents, reserveGoalCents: cents }))
      .mutation(async ({ ctx, input }) => {
        const business = await requireBusiness(ctx.user.id);
        await db.updateBusiness({ businessId: business.id, ...input });
        return { success: true };
      }),
  }),
  products: router({
    create: protectedProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
      const business = await requireBusiness(ctx.user.id);
      const productId = await db.createProduct(business.id, input);
      return { productId };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), product: productSchema })).mutation(async ({ ctx, input }) => {
      const business = await requireBusiness(ctx.user.id);
      await db.updateProduct(business.id, input.id, input.product);
      return { success: true };
    }),
    replenish: protectedProcedure.input(z.object({ id: z.number().int().positive(), stockUnits: z.number().int().min(1).max(1_000_000) })).mutation(async ({ ctx, input }) => {
      const business = await requireBusiness(ctx.user.id);
      await db.replenishProduct(business.id, input.id, input.stockUnits);
      return { success: true };
    }),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const business = await requireBusiness(ctx.user.id);
      return db.deleteProduct(business.id, input.id);
    }),
  }),
  sales: router({
    create: protectedProcedure
      .input(z.object({
        paymentMethod: z.enum(["cash", "pix", "card", "credit"]),
        note: z.string().trim().max(280).optional(),
        items: z.array(z.object({ exitModeId: z.number().int().positive(), quantity: z.number().int().min(1).max(1_000) })).min(1).max(30),
      }))
      .mutation(async ({ ctx, input }) => {
        const business = await requireBusiness(ctx.user.id);
        const duplicateMode = new Set<number>();
        if (input.items.some((item) => duplicateMode.has(item.exitModeId) || !duplicateMode.add(item.exitModeId))) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cada modalidade deve aparecer uma vez na venda." });
        }
        try {
          return await db.createSale({ businessId: business.id, userId: ctx.user.id, ...input });
        } catch (error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Não foi possível concluir a venda." });
        }
      }),
  }),
  finances: router({
    createEntry: protectedProcedure
      .input(z.object({ type: z.enum(["cost", "expense", "withdrawal", "capital", "reserve"]), amountCents: requiredCents, description: z.string().trim().min(2).max(280), occurredAt: z.coerce.date() }))
      .mutation(async ({ ctx, input }) => {
        const business = await requireBusiness(ctx.user.id);
        const entryId = await db.createFinancialEntry({ businessId: business.id, userId: ctx.user.id, ...input });
        return { entryId };
      }),
  }),
  reports: router({
    month: protectedProcedure
      .input(z.object({ year: z.number().int().min(2020).max(2100), month: z.number().int().min(1).max(12) }))
      .query(async ({ ctx, input }) => {
        const business = await requireBusiness(ctx.user.id);
        const { start, end } = getMonthRange(input.year, input.month);
        return db.getMonthlyWorkspace(business.id, start, end);
      }),
  }),
  learning: router({
    progress: protectedProcedure.query(async ({ ctx }) => {
      const business = await requireBusiness(ctx.user.id);
      return db.getLessonProgress(business.id, ctx.user.id);
    }),
    complete: protectedProcedure.input(z.object({ lessonKey: z.string().trim().min(2).max(80) })).mutation(async ({ ctx, input }) => {
      const business = await requireBusiness(ctx.user.id);
      await db.completeLesson(business.id, ctx.user.id, input.lessonKey);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
