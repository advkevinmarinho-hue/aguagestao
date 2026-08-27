import { and, asc, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  businesses,
  financialEntries,
  InsertUser,
  lessonProgress,
  productExitModes,
  products,
  saleItems,
  sales,
  users,
} from "../drizzle/schema";
import type { FinancialEntryType, PaymentMethod } from "../shared/business";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (['name', 'email', 'loginMethod'] as const).forEach((field) => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getBusinessForUser(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(businesses).where(eq(businesses.ownerUserId, userId)).limit(1);
  return result[0];
}

export async function createBusiness(input: { userId: number; name: string; monthlyGoalCents: number; reserveGoalCents: number }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const [result] = await db.insert(businesses).values({
    ownerUserId: input.userId,
    name: input.name,
    monthlyGoalCents: input.monthlyGoalCents,
    reserveGoalCents: input.reserveGoalCents,
  });
  return result.insertId;
}

export async function updateBusiness(input: { businessId: number; name: string; monthlyGoalCents: number; reserveGoalCents: number }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  await db
    .update(businesses)
    .set({ name: input.name, monthlyGoalCents: input.monthlyGoalCents, reserveGoalCents: input.reserveGoalCents })
    .where(eq(businesses.id, input.businessId));
}

export async function getWorkspace(businessId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const [business] = await db.select().from(businesses).where(eq(businesses.id, businessId)).limit(1);
  if (!business) return undefined;

  const productRows = await db.select().from(products).where(eq(products.businessId, businessId)).orderBy(desc(products.active), asc(products.name));
  const modeRows = await db.select().from(productExitModes).where(eq(productExitModes.businessId, businessId)).orderBy(asc(productExitModes.name));
  const salesRows = await db.select().from(sales).where(eq(sales.businessId, businessId)).orderBy(desc(sales.createdAt));
  const saleIds = salesRows.map((sale) => sale.id);
  const saleItemRows = saleIds.length
    ? await db.select().from(saleItems).where(inArray(saleItems.saleId, saleIds)).orderBy(desc(saleItems.createdAt))
    : [];
  const entryRows = await db.select().from(financialEntries).where(eq(financialEntries.businessId, businessId)).orderBy(desc(financialEntries.occurredAt));

  return {
    business,
    products: productRows.map((product) => ({
      ...product,
      exitModes: modeRows.filter((mode) => mode.productId === product.id),
    })),
    sales: salesRows,
    saleItems: saleItemRows,
    financialEntries: entryRows,
  };
}

export async function getMonthlyWorkspace(businessId: number, start: Date, end: Date) {
  const workspace = await getWorkspace(businessId);
  if (!workspace) return undefined;
  return {
    ...workspace,
    sales: workspace.sales.filter((sale) => sale.createdAt >= start && sale.createdAt < end),
    financialEntries: workspace.financialEntries.filter((entry) => entry.occurredAt >= start && entry.occurredAt < end),
  };
}

type ExitModeInput = { name: string; priceCents: number; stockUnits: number; active?: boolean };
type ProductInput = {
  name: string;
  category: string;
  defaultPriceCents: number;
  unitCostCents: number;
  stockUnits: number;
  minimumStockUnits: number;
  active: boolean;
  exitModes: ExitModeInput[];
};

function normalizeExitModes(product: ProductInput) {
  return product.exitModes.length
    ? product.exitModes
    : [{ name: "Venda padrão", priceCents: product.defaultPriceCents, stockUnits: 1, active: true }];
}

export async function createProduct(businessId: number, input: ProductInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  return db.transaction(async (tx) => {
    const [result] = await tx.insert(products).values({
      businessId,
      name: input.name,
      category: input.category,
      defaultPriceCents: input.defaultPriceCents,
      unitCostCents: input.unitCostCents,
      stockUnits: input.stockUnits,
      minimumStockUnits: input.minimumStockUnits,
      active: input.active,
    });
    const productId = result.insertId;
    await tx.insert(productExitModes).values(
      normalizeExitModes(input).map((mode) => ({
        businessId,
        productId,
        name: mode.name,
        priceCents: mode.priceCents,
        stockUnits: mode.stockUnits,
        active: mode.active ?? true,
      })),
    );
    return productId;
  });
}

export async function updateProduct(businessId: number, productId: number, input: ProductInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.businessId, businessId)))
      .limit(1);
    if (!existing) throw new Error("Produto não encontrado neste negócio.");
    await tx
      .update(products)
      .set({
        name: input.name,
        category: input.category,
        defaultPriceCents: input.defaultPriceCents,
        unitCostCents: input.unitCostCents,
        stockUnits: input.stockUnits,
        minimumStockUnits: input.minimumStockUnits,
        active: input.active,
      })
      .where(eq(products.id, productId));
    await tx.delete(productExitModes).where(and(eq(productExitModes.productId, productId), eq(productExitModes.businessId, businessId)));
    await tx.insert(productExitModes).values(
      normalizeExitModes(input).map((mode) => ({
        businessId,
        productId,
        name: mode.name,
        priceCents: mode.priceCents,
        stockUnits: mode.stockUnits,
        active: mode.active ?? true,
      })),
    );
  });
}

export async function replenishProduct(businessId: number, productId: number, stockUnits: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  await db
    .update(products)
    .set({ stockUnits: sql`${products.stockUnits} + ${stockUnits}` })
    .where(and(eq(products.id, productId), eq(products.businessId, businessId)));
}

export async function deleteProduct(businessId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.businessId, businessId)))
      .limit(1);
    if (!existing) throw new Error("Produto não encontrado neste negócio.");
    const history = await tx.select({ id: saleItems.id }).from(saleItems).where(eq(saleItems.productId, productId)).limit(1);
    if (history.length) {
      await tx.update(products).set({ active: false }).where(eq(products.id, productId));
      return { deactivated: true };
    }
    await tx.delete(productExitModes).where(eq(productExitModes.productId, productId));
    await tx.delete(products).where(eq(products.id, productId));
    return { deactivated: false };
  });
}

export async function createSale(input: { businessId: number; userId: number; paymentMethod: PaymentMethod; note?: string; items: { exitModeId: number; quantity: number }[] }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  return db.transaction(async (tx) => {
    const modeIds = input.items.map((item) => item.exitModeId);
    const records = await tx
      .select({ mode: productExitModes, product: products })
      .from(productExitModes)
      .innerJoin(products, eq(products.id, productExitModes.productId))
      .where(and(eq(productExitModes.businessId, input.businessId), inArray(productExitModes.id, modeIds)));

    if (records.length !== modeIds.length) throw new Error("Uma modalidade de saída não está disponível.");
    const recordByModeId = new Map(records.map((record) => [record.mode.id, record]));
    const consumptionByProduct = new Map<number, number>();
    let totalCents = 0;

    for (const item of input.items) {
      const record = recordByModeId.get(item.exitModeId);
      if (!record || !record.mode.active || !record.product.active) throw new Error("Este item não está disponível para venda.");
      const consumption = item.quantity * record.mode.stockUnits;
      consumptionByProduct.set(record.product.id, (consumptionByProduct.get(record.product.id) ?? 0) + consumption);
      totalCents += item.quantity * record.mode.priceCents;
    }

    for (const [productId, consumption] of consumptionByProduct) {
      const product = records.find((record) => record.product.id === productId)?.product;
      if (!product || product.stockUnits < consumption) throw new Error("Estoque insuficiente para concluir esta venda.");
      await tx
        .update(products)
        .set({ stockUnits: sql`${products.stockUnits} - ${consumption}` })
        .where(and(eq(products.id, productId), eq(products.businessId, input.businessId), gte(products.stockUnits, consumption)));
    }

    const [saleResult] = await tx.insert(sales).values({
      businessId: input.businessId,
      userId: input.userId,
      totalCents,
      paymentMethod: input.paymentMethod,
      note: input.note?.trim() || null,
    });
    const saleId = saleResult.insertId;
    await tx.insert(saleItems).values(
      input.items.map((item) => {
        const record = recordByModeId.get(item.exitModeId)!;
        return {
          saleId,
          productId: record.product.id,
          productNameSnapshot: record.product.name,
          quantity: item.quantity,
          priceCents: record.mode.priceCents,
          unitCostCents: record.product.unitCostCents,
          subtotalCents: item.quantity * record.mode.priceCents,
          exitModeId: record.mode.id,
          exitModeNameSnapshot: record.mode.name,
          stockUnits: record.mode.stockUnits,
        };
      }),
    );
    return { saleId, totalCents };
  });
}

export async function createFinancialEntry(input: { businessId: number; userId: number; type: FinancialEntryType; amountCents: number; description: string; occurredAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const [result] = await db.insert(financialEntries).values(input);
  return result.insertId;
}

export async function getLessonProgress(businessId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  return db.select().from(lessonProgress).where(and(eq(lessonProgress.businessId, businessId), eq(lessonProgress.userId, userId))).orderBy(asc(lessonProgress.lessonKey));
}

export async function completeLesson(businessId: number, userId: number, lessonKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  await db.insert(lessonProgress).values({ businessId, userId, lessonKey, completedAt: new Date() }).onDuplicateKeyUpdate({ set: { completedAt: new Date() } });
}
