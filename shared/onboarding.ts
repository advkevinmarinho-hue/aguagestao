export type OnboardingInput = {
  name: string;
  monthlyGoal: string;
  reserveGoal: string;
};

export type OnboardingPayload = {
  name: string;
  monthlyGoalCents: number;
  reserveGoalCents: number;
};

const MAX_MONEY_CENTS = 100_000_000;

export function parseBRLToCents(value: string): number | null {
  const cleaned = value.trim().replace(/R\$/gi, "").replace(/\s/g, "");
  if (!cleaned) return 0;
  if (cleaned.includes("-")) return null;

  const hasComma = cleaned.includes(",");
  const normalized = hasComma
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(/[^0-9.]/g, "");

  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return null;

  const cents = Math.round(parsed * 100);
  return cents <= MAX_MONEY_CENTS ? cents : null;
}

export function buildOnboardingPayload(input: OnboardingInput):
  | { ok: true; payload: OnboardingPayload }
  | { ok: false; field: keyof OnboardingInput; message: string } {
  const name = input.name.trim().replace(/\s+/g, " ");
  if (name.length < 2) {
    return { ok: false, field: "name", message: "Informe um nome com pelo menos 2 caracteres." };
  }
  if (name.length > 120) {
    return { ok: false, field: "name", message: "O nome do negócio deve ter no máximo 120 caracteres." };
  }

  const monthlyGoalCents = parseBRLToCents(input.monthlyGoal);
  if (monthlyGoalCents === null) {
    return { ok: false, field: "monthlyGoal", message: "Informe uma meta mensal válida, como 5.000,00." };
  }

  const reserveGoalCents = parseBRLToCents(input.reserveGoal);
  if (reserveGoalCents === null) {
    return { ok: false, field: "reserveGoal", message: "Informe uma meta de reserva válida, como 1.000,00." };
  }

  return { ok: true, payload: { name, monthlyGoalCents, reserveGoalCents } };
}

export function getOnboardingErrorMessage(message?: string): string {
  const normalized = message?.toLowerCase() ?? "";
  if (normalized.includes("já possui") || normalized.includes("conflict")) {
    return "Este negócio já foi configurado. Vamos atualizar seus dados e abrir a tela inicial.";
  }
  if (normalized.includes("unauthorized") || normalized.includes("não autorizado") || normalized.includes("sessão")) {
    return "Sua sessão expirou. Entre novamente para continuar com segurança.";
  }
  if (normalized.includes("network") || normalized.includes("fetch") || normalized.includes("conexão")) {
    return "Não foi possível conectar agora. Verifique a internet e tente novamente; seus dados digitados continuam na tela.";
  }
  return "Não foi possível salvar a configuração. Tente novamente em alguns instantes.";
}

export type InitialRoute = "loading" | "login" | "onboarding" | "home" | "error";

export function resolveInitialRoute(input: {
  authLoading: boolean;
  authenticated: boolean;
  workspaceLoading: boolean;
  workspaceFetching: boolean;
  workspaceError: boolean;
  hasWorkspaceData: boolean;
  hasBusiness: boolean;
}): InitialRoute {
  if (input.authLoading) return "loading";
  if (!input.authenticated) return "login";
  if (input.workspaceError && !input.hasWorkspaceData) return "error";
  if (input.workspaceLoading || input.workspaceFetching || !input.hasWorkspaceData) return "loading";
  return input.hasBusiness ? "home" : "onboarding";
}
