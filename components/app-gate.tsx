import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LoadingState, ErrorState } from "@/components/app-ui";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { resolveInitialRoute } from "@/shared/onboarding";

export function AppGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const workspace = trpc.workspace.get.useQuery(undefined, { enabled: isAuthenticated, retry: 1 });
  const belongsToCurrentUser = !workspace.data?.business || workspace.data.business.ownerUserId === user?.id;
  const route = resolveInitialRoute({
    authLoading,
    authenticated: isAuthenticated,
    workspaceLoading: workspace.isLoading,
    workspaceFetching: (workspace.isFetching && !workspace.data) || !belongsToCurrentUser,
    workspaceError: workspace.isError,
    hasWorkspaceData: workspace.data !== undefined && belongsToCurrentUser,
    hasBusiness: Boolean(workspace.data?.business && belongsToCurrentUser),
  });

  useEffect(() => {
    if (route === "login") router.replace("/login");
  }, [route, router]);

  useEffect(() => {
    if (route === "onboarding") router.replace("/onboarding" as never);
  }, [route, router]);

  if (route === "error") return <ScreenContainer><ErrorState description="Não foi possível confirmar seus dados. Verifique a conexão e tente novamente." onRetry={() => workspace.refetch()} /></ScreenContainer>;
  if (route !== "home") return <ScreenContainer><LoadingState label={route === "onboarding" ? "Preparando a configuração inicial..." : "Confirmando sua conta e seus dados..."} /></ScreenContainer>;
  return <>{children}</>;
}
