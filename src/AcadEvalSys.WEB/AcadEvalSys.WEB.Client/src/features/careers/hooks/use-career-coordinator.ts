import { useQuery } from "@tanstack/react-query";
import { technicalCareerService } from "../services/technical-career-service";

export function useCareerCoordinator(careerId: string | undefined) {
  return useQuery({
    queryKey: ["career-coordinator", careerId],
    queryFn: () => technicalCareerService.getCareerCoordinator(careerId || ""),
    enabled: !!careerId,
  });
}
