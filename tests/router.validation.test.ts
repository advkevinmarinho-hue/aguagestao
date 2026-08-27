import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

function caller() {
  const now = new Date();
  const ctx: TrpcContext = {
    user: { id: 99, openId: "validation-user", email: "validation@example.com", name: "Validation", loginMethod: "test", role: "user", createdAt: now, updatedAt: now, lastSignedIn: now },
    req: { protocol: "https", hostname: "validation.example.com", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

async function expectBadRequest(action: Promise<unknown>) {
  await expect(action).rejects.toMatchObject({ code: "BAD_REQUEST" });
}

describe("router input validation", () => {
  it("rejects empty or too-short business names", async () => {
    const api = caller();
    await expectBadRequest(api.workspace.setup({ name: " ", monthlyGoalCents: 0, reserveGoalCents: 0 }));
    await expectBadRequest(api.workspace.setup({ name: "A", monthlyGoalCents: 0, reserveGoalCents: 0 }));
  });

  it("rejects negative goals and malformed products", async () => {
    const api = caller();
    await expectBadRequest(api.workspace.setup({ name: "SK Água", monthlyGoalCents: -1, reserveGoalCents: 0 }));
    await expectBadRequest(api.products.create({ name: "Água", category: "Galões", defaultPriceCents: 0, unitCostCents: 100, stockUnits: 1, minimumStockUnits: 0, active: true, exitModes: [] }));
  });

  it("rejects sales without items or with invalid payment method", async () => {
    const api = caller();
    await expectBadRequest(api.sales.create({ paymentMethod: "pix", items: [] }));
    await expectBadRequest(api.sales.create({ paymentMethod: "boleto" as never, items: [{ exitModeId: 1, quantity: 1 }] }));
    await expectBadRequest(api.sales.create({ paymentMethod: "cash", items: [{ exitModeId: 1, quantity: 0 }] }));
  });

  it("rejects financial entries without positive value or description", async () => {
    const api = caller();
    await expectBadRequest(api.finances.createEntry({ type: "expense", amountCents: 0, description: "Conta", occurredAt: new Date() }));
    await expectBadRequest(api.finances.createEntry({ type: "expense", amountCents: 100, description: " ", occurredAt: new Date() }));
    await expectBadRequest(api.finances.createEntry({ type: "other" as never, amountCents: 100, description: "Conta", occurredAt: new Date() }));
  });

  it("rejects invalid month and invalid lesson keys", async () => {
    const api = caller();
    await expectBadRequest(api.reports.month({ year: 2026, month: 13 }));
    await expectBadRequest(api.reports.month({ year: 2010, month: 1 }));
    await expectBadRequest(api.learning.complete({ lessonKey: "x" }));
  });
});
