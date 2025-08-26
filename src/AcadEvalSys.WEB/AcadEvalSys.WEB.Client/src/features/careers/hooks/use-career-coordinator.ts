import { useQuery } from "@tanstack/react-query";
import { getCareerCoordinator } from "@/shared/services/technical-career-service";

export function useCareerCoordinator(careerId: string | undefined) {
  return useQuery({
    queryKey: ["career-coordinator", careerId],
    queryFn: () => getCareerCoordinator(careerId || ""),
    enabled: !!careerId,
  });
}
