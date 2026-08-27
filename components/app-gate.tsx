import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { LoadingState, ErrorState } from "@/components/app-ui";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export function AppGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const workspace = trpc.workspace.get.useQuery(undefined, { enabled: isAuthenticated, retry: 1 });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && workspace.data?.business === null) router.replace("/onboarding" as never);
  }, [isAuthenticated, router, workspace.data?.business]);

  if (authLoading || (isAuthenticated && workspace.isLoading)) {
    return <ScreenContainer><LoadingState /></ScreenContainer>;
  }
  if (!isAuthenticated || workspace.data?.business === null) return <ScreenContainer><LoadingState label="Preparando seu espaço..." /></ScreenContainer>;
  if (workspace.isError) return <ScreenContainer><ErrorState description="Verifique a conexão e tente novamente." onRetry={() => workspace.refetch()} /></ScreenContainer>;
  return <>{children}</>;
}
