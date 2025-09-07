import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@infrastructure/api/clients/dashboard-service";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  });
};
