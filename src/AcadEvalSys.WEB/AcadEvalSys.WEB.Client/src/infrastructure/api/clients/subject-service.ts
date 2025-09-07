import { api } from "@infrastructure/query/axios";
import {
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "@infrastructure/api/types/subject";
import type { Student } from "@infrastructure/api/types/student";

const SUBJECTS_API_URL = "/technical-careers";

export const getSubjectsByCareer = async (
  careerId: string,
  year?: string,
  includeEnrolledStudents = false
): Promise<Subject[]> => {
  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (includeEnrolledStudents) {
    params.append("includeEnrolledStudents", "true");
  }

  const url = `${SUBJECTS_API_URL}/${careerId}/subjects?${params}`;
  const { data } = await api.get<Subject[]>(url);
  return data;
};

export const getSubjectById = async (
  careerId: string,
  subjectId: string,
  includeEnrolledStudents = false
): Promise<Subject> => {
  const params = new URLSearchParams();
  if (includeEnrolledStudents) {
    params.append("includeEnrolledStudents", "true");
  }

  const url = `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}?${params}`;
  const { data } = await api.get<Subject>(url);
  return data;
};

export const createSubject = async (
  careerId: string,
  subject: CreateSubjectRequest
): Promise<string> => {
  const { data } = await api.post<{ id: string }>(
    `${SUBJECTS_API_URL}/${careerId}/subjects`,
    subject
  );
  return data.id;
};

export const updateSubject = async (
  careerId: string,
  subjectId: string,
  subject: UpdateSubjectRequest
): Promise<void> => {
  await api.put(
    `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}`,
    subject
  );
};

export const deleteSubject = async (
  careerId: string,
  subjectId: string
): Promise<void> => {
  await api.delete(`${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}`);
};

export const assignProfessor = async (
  careerId: string,
  subjectId: string,
  professorId: string
): Promise<void> => {
  await api.put(
    `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/assign-professor`,
    {
      professorId,
    }
  );
};

export const enrollStudent = async (
  careerId: string,
  subjectId: string,
  studentId: string
): Promise<void> => {
  await api.post(
    `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/enroll-student`,
    {
      studentId,
    }
  );
};

// Desinscribir UN estudiante de una asignatura
export const unenrollStudent = async (
  careerId: string,
  subjectId: string,
  studentId: string
): Promise<boolean> => {
  const { status } = await api.delete(
    `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/students/${studentId}`
  );
  return status === 200;
};

// Desinscribir VARIOS estudiantes de una asignatura
export interface UnenrollStudentsResult {
  studentsUnenrolled: number;
  studentsNotFound: string[];
  errors: string[];
}

export const unenrollStudents = async (
  careerId: string,
  subjectId: string,
  studentIds: string[]
): Promise<UnenrollStudentsResult> => {
  const { data } = await api.post<UnenrollStudentsResult>(
    `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/students/bulk-unenroll`,
    { studentIds }
  );
  return data;
};

export const getAvailableStudentsForSubject = async (
  careerId: string,
  subjectId: string,
  year?: "First" | "Second" | "Third"
): Promise<Student[]> => {
  const params = new URLSearchParams();
  if (year) params.append("year", year);
  const url = `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/available-students?${params.toString()}`;

  const { data } = await api.get<Student[]>(url);

  return data;
};
