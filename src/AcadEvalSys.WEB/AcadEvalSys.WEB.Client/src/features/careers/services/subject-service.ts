import { api } from "@infrastructure/query/axios";
import type { Subject } from "../models";
import type { UnenrollStudentsResult } from "../models";

export async function enrollStudent(careerId: string, subjectId: string, studentId: string) {
  await api.post(`/technical-careers/${careerId}/subjects/${subjectId}/enroll-student`, { studentId });
}

export async function deleteSubject(careerId: string, subjectId: string) {
  await api.delete(`/technical-careers/${careerId}/subjects/${subjectId}`);
}

export async function createSubject(
  careerId: string,
  body: { name: string; description: string; year: "First" | "Second" | "Third"; professorId?: string }
): Promise<string> {
  const { data } = await api.post<{ id: string }>(`/technical-careers/${careerId}/subjects`, body);
  return data.id;
}

export async function assignProfessor(
  careerId: string,
  subjectId: string,
  professorId: string
): Promise<void> {
  await api.put(`/technical-careers/${careerId}/subjects/${subjectId}/assign-professor`, {
    professorId,
  });
}

export async function unenrollStudent(
  careerId: string,
  subjectId: string,
  studentId: string
): Promise<boolean> {
  const { data } = await api.delete<{ success: boolean }>(
    `/technical-careers/${careerId}/subjects/${subjectId}/students/${studentId}`
  );
  return data?.success ?? true;
}

export async function unenrollStudents(
  careerId: string,
  subjectId: string,
  studentIds: string[]
): Promise<UnenrollStudentsResult> {
  const { data } = await api.post<UnenrollStudentsResult>(
    `/technical-careers/${careerId}/subjects/${subjectId}/students/bulk-unenroll`,
    { studentIds }
  );
  return data;
}

export async function getSubjectsByCareer(
  careerId: string,
  year?: "First" | "Second" | "Third",
  includeEnrolledStudents?: boolean
): Promise<Subject[]> {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  if (includeEnrolledStudents) params.set("includeEnrolledStudents", "true");
  const qs = params.toString();
  const { data } = await api.get<Subject[]>(
    `/technical-careers/${careerId}/subjects${qs ? `?${qs}` : ""}`
  );
  return data;
}

export async function getSubjectById(
  careerId: string,
  subjectId: string,
  includeEnrolledStudents?: boolean
) {
  const params = new URLSearchParams();
  if (includeEnrolledStudents) params.set("includeEnrolledStudents", "true");
  const qs = params.toString();
  const { data } = await api.get(
    `/technical-careers/${careerId}/subjects/${subjectId}${qs ? `?${qs}` : ""}`
  );
  return data;
}

export async function getAvailableStudentsForSubject(
  careerId: string,
  subjectId: string,
  year?: "First" | "Second" | "Third"
) {
  const params = new URLSearchParams();
  if (year) params.set("year", year);
  const qs = params.toString();
  const { data } = await api.get(
    `/technical-careers/${careerId}/subjects/${subjectId}/available-students${qs ? `?${qs}` : ""}`
  );
  return data;
}

export async function updateSubject(
  careerId: string,
  subjectId: string,
  updateData: {
    name: string;
    description?: string;
    year: "First" | "Second" | "Third" | string;
    professorId?: string;
  }
): Promise<void> {
  // Map string year to enum if needed
  let year: "First" | "Second" | "Third";
  if (updateData.year === "First" || updateData.year === "Second" || updateData.year === "Third") {
    year = updateData.year;
  } else {
    // Default fallback or throw error
    year = "First";
  }
  
  const payload = {
    name: updateData.name,
    description: updateData.description,
    year,
    professorId: updateData.professorId
  };
  
  await api.put(`/technical-careers/${careerId}/subjects/${subjectId}`, payload);
}


