import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export function useWorkspace() {
  const auth = useAuth();
  const query = trpc.workspace.get.useQuery(undefined, { enabled: auth.isAuthenticated });
  return { ...query, user: auth.user, isAuthenticated: auth.isAuthenticated, authLoading: auth.loading };
}
