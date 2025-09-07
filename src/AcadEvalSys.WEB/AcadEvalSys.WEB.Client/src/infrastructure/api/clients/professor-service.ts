import { api } from "@infrastructure/query/axios";
import {
  Professor,
  CreateProfessorRequest,
  UpdateProfessorRequest,
} from "@infrastructure/api/types/professor";
import { AxiosError } from "axios";

const PROFESSORS_API_URL = "/professors";

interface DeleteProfessorErrorResponse {
  message?: string;
  hasAssignments?: boolean;
  assignedSubjects?: Array<{
    id: string;
    name: string;
    careerName: string;
    year: number;
  }>;
}

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
        subjects?: { id: string; name: string }[];
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
      items: { id: string; name: string; email: string; phone?: string }[];
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

  async delete(id: string): Promise<{
    success: boolean;
    hasAssignments?: boolean;
    assignedSubjects?: Array<{
      id: string;
      name: string;
      careerName: string;
      year: number;
    }>;
    message?: string;
  }> {
    try {
      await api.delete(`${PROFESSORS_API_URL}/${id}`);
      // Status 204 - eliminación exitosa
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<DeleteProfessorErrorResponse>;
      // Status 400 - profesor tiene asignaciones
      if (axiosError.response?.status === 400) {
        return {
          success: false,
          hasAssignments: true,
          assignedSubjects: axiosError.response.data?.assignedSubjects || [],
          message:
            axiosError.response.data?.message ||
            "El profesor tiene asignaturas asignadas",
        };
      }

      // Status 404 - profesor no encontrado
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          message:
            axiosError.response.data?.message || "Profesor no encontrado",
        };
      }

      // Otros errores (401, 403, 500+) ya son manejados por el interceptor
      // Re-lanzamos para que lleguen al onError del mutation
      throw error;
    }
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
  ): Promise<{ id: string; name: string; description: string }[]> {
    const params = evaluationInstanceId
      ? `?evaluationInstanceId=${evaluationInstanceId}`
      : "";
    const { data } = await api.get(
      `${PROFESSORS_API_URL}/${professorId}/assignments${params}`
    );
    return data;
  },

  async getStudentsByAssignment(
    assignmentId: string
  ): Promise<{ id: string; name: string; email: string }[]> {
    const { data } = await api.get(
      `${PROFESSORS_API_URL}/assignments/${assignmentId}/students`
    );
    return data;
  },
};

export const getProfessors = professorService.getAll;
export const getProfessorById = professorService.getById;
export const getProfessorAssignments = professorService.getAssignments;
export const createProfessor = professorService.create;
export const updateProfessor = professorService.update;
export const deleteProfessor = professorService.delete;
export const getStudentsByAssignment = professorService.getStudentsByAssignment;
