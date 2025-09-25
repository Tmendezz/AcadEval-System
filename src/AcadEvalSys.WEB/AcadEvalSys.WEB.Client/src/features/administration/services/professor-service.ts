import { api } from "@/infrastructure/query/axios";

export const professorService = {
  async getAll(params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; technicalCareerId?: string }) {
    const { data } = await api.get("/professors", { params });
    return data as { items: Array<{ userId: string; name: string; email: string; phone?: string }> };
  },

  async create(body: { name: string; email: string; password: string; phone?: string }) {
    const { data } = await api.post<{ id: string }>("/professors", body);
    return data.id;
  },

  async update(id: string, body: { name?: string; email?: string; password?: string; phone?: string }) {
    await api.put(`/professors/${id}`, body);
    return id;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/professors/${id}`);
    return data as { success: boolean; hasAssignments?: boolean; assignedSubjects?: Array<{ id: string; name: string; careerName: string; year: number }>; message?: string };
  },
};


