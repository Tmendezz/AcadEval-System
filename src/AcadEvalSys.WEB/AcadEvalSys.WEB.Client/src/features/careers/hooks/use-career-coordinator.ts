import { useQuery } from "@tanstack/react-query";
import { getCareerCoordinator } from "@infrastructure/api/clients/technical-career-service";

export function useCareerCoordinator(careerId: string | undefined) {
  return useQuery({
    queryKey: ["career-coordinator", careerId],
    queryFn: () => getCareerCoordinator(careerId || ""),
    enabled: !!careerId,
  });
}
