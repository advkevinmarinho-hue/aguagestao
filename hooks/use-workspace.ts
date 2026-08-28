import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export function useWorkspace() {
  const auth = useAuth();
  const query = trpc.workspace.get.useQuery(undefined, { enabled: auth.isAuthenticated });
  const belongsToCurrentUser = !query.data?.business || query.data.business.ownerUserId === auth.user?.id;
  return {
    ...query,
    data: belongsToCurrentUser ? query.data : undefined,
    isLoading: auth.loading || query.isLoading || (query.isFetching && !query.data) || !belongsToCurrentUser,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    authLoading: auth.loading,
  };
}
