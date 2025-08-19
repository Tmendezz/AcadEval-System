import { api } from "@/shared/config/axios";
import {
  Professor,
  CreateProfessorRequest,
  UpdateProfessorRequest,
} from "@/shared/types/professor";

const PROFESSORS_API_URL = "/professors";

export const professorService = {
  // ✅ Métodos para listado y paginación
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
      items: Array<{
        userId: string;
        name: string;
        email: string;
        phone?: string;
        subjects?: any[];
      }>;
      totalItemsCount: number;
      totalPages: number;
      itemsFrom: number;
      itemsTo: number;
    }>(`${PROFESSORS_API_URL}?${params}`);

    // Mapear la respuesta de la API al tipo Professor esperado
    const professors: Professor[] = (data.items ?? []).map((item) => ({
      id: item.userId, // Mapear userId a id
      name: item.name,
      email: item.email,
    }));

    return {
      professors,
      totalCount: data.totalItemsCount ?? 0,
    };
  },

  // ✅ Método específico para administradores
  async getAllAdmins(
    pageNumber = 1,
    pageSize = 50,
    searchTerm?: string
  ): Promise<{ admins: Professor[]; totalCount: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) params.append("searchTerm", searchTerm);

    const { data } = await api.get<{
      items: any[];
      totalItemsCount: number;
    }>(`/identity/admins?${params}`);

    const admins: Professor[] = data.items.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    }));

    return { admins, totalCount: data.totalItemsCount };
  },

  // ✅ CRUD básico
  async getById(id: string): Promise<Professor> {
    const { data } = await api.get<Professor>(`${PROFESSORS_API_URL}/${id}`);
    return data;
  },

  async create(request: CreateProfessorRequest): Promise<string> {
    const { data } = await api.post<{ id: string }>(
      PROFESSORS_API_URL,
      request
    );
    return data.id;
  },

  async update(id: string, request: UpdateProfessorRequest): Promise<void> {
    await api.put(`${PROFESSORS_API_URL}/${id}`, request);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${PROFESSORS_API_URL}/${id}`);
  },

  // ✅ Métodos para asignaciones
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

  async getAssignments(
    professorId: string,
    evaluationInstanceId?: string
  ): Promise<any[]> {
    const params = evaluationInstanceId
      ? `?evaluationInstanceId=${evaluationInstanceId}`
      : "";
    const { data } = await api.get(
      `${PROFESSORS_API_URL}/${professorId}/assignments${params}`
    );
    return data;
  },

  async getStudentsByAssignment(assignmentId: string): Promise<any[]> {
    const { data } = await api.get(
      `${PROFESSORS_API_URL}/assignments/${assignmentId}/students`
    );
    return data;
  },
};

// ✅ Exportaciones con nombres compatibles hacia atrás
export const getProfessors = professorService.getAll;
export const getProfessorById = professorService.getById;
export const createProfessor = professorService.create;
export const updateProfessor = professorService.update;
export const deleteProfessor = professorService.delete;
export const getProfessorAssignments = professorService.getAssignments;
export const getStudentsByAssignment = professorService.getStudentsByAssignment;
