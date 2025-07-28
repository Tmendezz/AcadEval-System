import { api } from "@/shared/config/axios";
import {
  Professor,
  CreateProfessorRequest,
  UpdateProfessorRequest,
} from "@/shared/types";

const PROFESSORS_API_URL = "/professors";

export const getProfessors = async (
  pageNumber = 1,
  pageSize = 50,
  searchTerm?: string,
  technicalCareerId?: string
): Promise<{ professors: Professor[]; totalCount: number }> => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchTerm) params.append("searchTerm", searchTerm);
  if (technicalCareerId) params.append("technicalCareerId", technicalCareerId);

  const { data } = await api.get<{
    professors: Professor[];
    totalCount: number;
  }>(`${PROFESSORS_API_URL}?${params}`);
  return data;
};

export const getProfessorById = async (id: string): Promise<Professor> => {
  const { data } = await api.get<Professor>(`${PROFESSORS_API_URL}/${id}`);
  return data;
};

export const createProfessor = async (
  professor: CreateProfessorRequest
): Promise<void> => {
  await api.post(PROFESSORS_API_URL, professor);
};

export const updateProfessor = async (
  id: string,
  professor: UpdateProfessorRequest
): Promise<void> => {
  await api.put(`${PROFESSORS_API_URL}/${id}`, professor);
};

export const deleteProfessor = async (id: string): Promise<void> => {
  await api.delete(`${PROFESSORS_API_URL}/${id}`);
};

export const getProfessorAssignments = async (
  professorId: string,
  evaluationInstanceId?: string
): Promise<any[]> => {
  const params = evaluationInstanceId
    ? `?evaluationInstanceId=${evaluationInstanceId}`
    : "";
  const { data } = await api.get(
    `${PROFESSORS_API_URL}/${professorId}/assignments${params}`
  );
  return data;
};

export const getStudentsByAssignment = async (
  assignmentId: string
): Promise<any[]> => {
  const { data } = await api.get(
    `${PROFESSORS_API_URL}/assignments/${assignmentId}/students`
  );
  return data;
};
