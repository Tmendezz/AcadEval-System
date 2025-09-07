import { api } from "@infrastructure/query/axios";
import { StudentForEvaluation, ProfessorAssignment } from "../models";

const PROFESSOR_ASSIGNMENTS_API_URL = "/professor-assignments";

export const getProfessorAssignmentById = async (
  assignmentId: string
): Promise<ProfessorAssignment> => {
  const { data } = await api.get<ProfessorAssignment>(
    `${PROFESSOR_ASSIGNMENTS_API_URL}/${assignmentId}`
  );
  return data;
};

export const getStudentsForAssignment = async (
  assignmentId: string
): Promise<StudentForEvaluation[]> => {
  const { data } = await api.get<StudentForEvaluation[]>(
    `${PROFESSOR_ASSIGNMENTS_API_URL}/${assignmentId}/students`
  );
  return data;
};

export const getAllProfessorAssignments = async (): Promise<
  ProfessorAssignment[]
> => {
  const { data } = await api.get<ProfessorAssignment[]>(
    PROFESSOR_ASSIGNMENTS_API_URL
  );
  return data;
};

export const assessStudent = async (
  assignmentId: string,
  studentId: string,
  assessment: {
    competencyLevel: string;
    comments?: string;
  }
): Promise<void> => {
  await api.post(
    `${PROFESSOR_ASSIGNMENTS_API_URL}/${assignmentId}/students/${studentId}/assess`,
    assessment
  );
};
