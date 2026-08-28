import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "../server/_core/context";

vi.mock("../server/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../server/db")>();
  return {
    ...actual,
    getBusinessForUser: vi.fn(),
    createBusiness: vi.fn(),
    updateBusiness: vi.fn(),
  };
});

import * as db from "../server/db";
import { appRouter } from "../server/routers";

function createCaller() {
  const now = new Date();
  const ctx: TrpcContext = {
    user: { id: 42, openId: "expo-go-user", email: "expo@example.com", name: "Expo User", loginMethod: "test", role: "user", createdAt: now, updatedAt: now, lastSignedIn: now },
    req: { protocol: "https", hostname: "app.example.com", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

describe("workspace setup reliability", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a business on the first valid submission", async () => {
    vi.mocked(db.getBusinessForUser).mockResolvedValue(undefined);
    vi.mocked(db.createBusiness).mockResolvedValue(77);

    const result = await createCaller().workspace.setup({ name: "SK Água", monthlyGoalCents: 500000, reserveGoalCents: 100000 });

    expect(result).toEqual({ businessId: 77, created: true });
    expect(db.createBusiness).toHaveBeenCalledWith({ userId: 42, name: "SK Água", monthlyGoalCents: 500000, reserveGoalCents: 100000 });
    expect(db.updateBusiness).not.toHaveBeenCalled();
  });

  it("updates and returns the existing business when the request is repeated", async () => {
    vi.mocked(db.getBusinessForUser).mockResolvedValue({
      id: 77,
      ownerUserId: 42,
      name: "SK Água",
      monthlyGoalCents: 0,
      reserveGoalCents: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createCaller().workspace.setup({ name: "SK Água Atualizada", monthlyGoalCents: 600000, reserveGoalCents: 120000 });

    expect(result).toEqual({ businessId: 77, created: false });
    expect(db.updateBusiness).toHaveBeenCalledWith({ businessId: 77, name: "SK Água Atualizada", monthlyGoalCents: 600000, reserveGoalCents: 120000 });
    expect(db.createBusiness).not.toHaveBeenCalled();
  });
});
