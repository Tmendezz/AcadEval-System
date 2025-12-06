import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service";
import type { DashboardStats } from "../models";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

export const useGetDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
