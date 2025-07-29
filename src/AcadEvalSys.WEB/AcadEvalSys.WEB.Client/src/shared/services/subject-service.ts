import { api } from "@/shared/config/axios";
import {
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "@/shared/types";

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
): Promise<void> => {
  await api.post(`${SUBJECTS_API_URL}/${careerId}/subjects`, subject);
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
