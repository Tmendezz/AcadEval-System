import { api } from "@/infrastructure/query/axios";
import { userManagementService } from "./user-management-service";

export interface ProfessorDto {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  subjects: Array<{ id: string; name: string; }>;
}

export interface PagedProfessorResult {
  items: ProfessorDto[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export const professorService = {
  async getAll(params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; technicalCareerId?: string }) {
    const { data } = await api.get("/professors", { params });
    return data as PagedProfessorResult;
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

  /**
   * Cambia la contraseña de un profesor
   * @deprecated Usar userManagementService.changePassword directamente
   */
  async changePassword(userId: string, newPassword: string) {
    return userManagementService.changePassword(userId, newPassword);
  },

  /**
   * Genera una contraseña temporal para un profesor
   */
  async generateTemporaryPassword(userId: string) {
    return userManagementService.generateTemporaryPassword(userId);
  },
};


