import { describe, expect, it } from "vitest";
import {
  buildOnboardingPayload,
  getOnboardingErrorMessage,
  parseBRLToCents,
  resolveInitialRoute,
} from "../shared/onboarding";

describe("onboarding money parsing", () => {
  it.each([
    ["", 0],
    ["0", 0],
    ["15", 1500],
    ["15,90", 1590],
    ["R$ 1.000,50", 100050],
    ["5.000,00", 500000],
    ["1000.50", 100050],
  ])("parses %s into cents", (value, expected) => {
    expect(parseBRLToCents(value)).toBe(expected);
  });

  it.each(["-1", "abc", "10,999", "1,2,3", "1.000.000,01"])("rejects invalid or excessive value %s", (value) => {
    expect(parseBRLToCents(value)).toBeNull();
  });
});

describe("onboarding payload", () => {
  it("normalizes the business name and optional empty goals", () => {
    const result = buildOnboardingPayload({ name: "  SK   Água  ", monthlyGoal: "", reserveGoal: "" });
    expect(result).toEqual({ ok: true, payload: { name: "SK Água", monthlyGoalCents: 0, reserveGoalCents: 0 } });
  });

  it("rejects short and oversized business names", () => {
    expect(buildOnboardingPayload({ name: "A", monthlyGoal: "", reserveGoal: "" })).toMatchObject({ ok: false, field: "name" });
    expect(buildOnboardingPayload({ name: "A".repeat(121), monthlyGoal: "", reserveGoal: "" })).toMatchObject({ ok: false, field: "name" });
  });

  it("identifies which monetary field is invalid", () => {
    expect(buildOnboardingPayload({ name: "SK", monthlyGoal: "abc", reserveGoal: "" })).toMatchObject({ ok: false, field: "monthlyGoal" });
    expect(buildOnboardingPayload({ name: "SK", monthlyGoal: "100", reserveGoal: "x" })).toMatchObject({ ok: false, field: "reserveGoal" });
  });
});

describe("initial navigation", () => {
  const base = { authLoading: false, authenticated: true, workspaceLoading: false, workspaceFetching: false, workspaceError: false, hasWorkspaceData: true, hasBusiness: true };

  it.each([
    [{ ...base, authLoading: true }, "loading"],
    [{ ...base, authenticated: false }, "login"],
    [{ ...base, workspaceLoading: true }, "loading"],
    [{ ...base, workspaceFetching: true }, "loading"],
    [{ ...base, workspaceError: true, hasWorkspaceData: false }, "error"],
    [{ ...base, hasWorkspaceData: false }, "loading"],
    [{ ...base, hasBusiness: false }, "onboarding"],
    [base, "home"],
  ] as const)("resolves the expected route", (state, expected) => {
    expect(resolveInitialRoute(state)).toBe(expected);
  });
});

describe("friendly onboarding errors", () => {
  it("maps session, network and conflict failures", () => {
    expect(getOnboardingErrorMessage("UNAUTHORIZED")).toContain("sessão expirou");
    expect(getOnboardingErrorMessage("Failed to fetch")).toContain("Verifique a internet");
    expect(getOnboardingErrorMessage("Este usuário já possui um negócio configurado.")).toContain("já foi configurado");
  });
});
