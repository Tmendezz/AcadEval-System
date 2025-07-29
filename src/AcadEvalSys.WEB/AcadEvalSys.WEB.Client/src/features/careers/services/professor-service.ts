import { api } from "@/shared/config/axios";
import { Professor } from "@/shared/types";

const PROFESSORS_API_URL = "/professors";

export const professorService = {
  async getAll(
    pageNumber = 1,
    pageSize = 50,
    searchTerm?: string,
    technicalCareerId?: string
  ): Promise<{ professors: Professor[]; totalCount: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) params.append("searchTerm", searchTerm);
    if (technicalCareerId)
      params.append("technicalCareerId", technicalCareerId);

    const { data } = await api.get<{
      professors: Professor[];
      totalCount: number;
    }>(`${PROFESSORS_API_URL}?${params}`);
    return data;
  },

  async getById(id: string): Promise<Professor> {
    const { data } = await api.get<Professor>(`${PROFESSORS_API_URL}/${id}`);
    return data;
  },

  async getAvailableProfessors(
    technicalCareerId?: string
  ): Promise<Professor[]> {
    const params = technicalCareerId
      ? `?technicalCareerId=${technicalCareerId}`
      : "";
    const { data } = await api.get<Professor[]>(
      `${PROFESSORS_API_URL}/available${params}`
    );
    return data;
  },
};
