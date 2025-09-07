import { api } from "@infrastructure/query/axios";

const DASHBOARD_API_URL = "/dashboard";

export interface DashboardStats {
  studentsCount: number;
  professorsCount: number;
  careersCount: number;
  evaluationsInProgressCount: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>(`${DASHBOARD_API_URL}/stats`);
  return data;
};
