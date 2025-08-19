import { api } from "@/shared/config/axios";
import { Student } from "@/shared/types/student";

const STUDENTS_API_URL = "/students";

/**
 * Servicio consolidado para gestión de estudiantes
 * Movido desde features/careers para uso global
 */
export const studentService = {
  async getAll(
    pageNumber = 1,
    pageSize = 50,
    searchTerm?: string,
    technicalCareerId?: string,
    currentYear?: number
  ): Promise<{ students: Student[]; totalCount: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) params.append("searchTerm", searchTerm);
    if (technicalCareerId)
      params.append("technicalCareerId", technicalCareerId);
    if (currentYear) params.append("currentYear", currentYear.toString());

    const { data } = await api.get<{ students: Student[]; totalCount: number }>(
      `${STUDENTS_API_URL}?${params}`
    );
    return data;
  },

  async getById(id: string): Promise<Student> {
    const { data } = await api.get<Student>(`${STUDENTS_API_URL}/${id}`);
    return data;
  },

  async getStudentsByCareer(
    technicalCareerId: string,
    currentYear?: number
  ): Promise<Student[]> {
    const params = new URLSearchParams({ technicalCareerId });
    if (currentYear) params.append("currentYear", currentYear.toString());

    const { data } = await api.get<Student[]>(
      `${STUDENTS_API_URL}/by-career?${params}`
    );
    return data;
  },

  async getAvailableStudents(
    technicalCareerId: string,
    currentYear?: number,
    excludeSubjectId?: string
  ): Promise<Student[]> {
    const params = new URLSearchParams({ technicalCareerId });
    if (currentYear) params.append("currentYear", currentYear.toString());
    if (excludeSubjectId) params.append("excludeSubjectId", excludeSubjectId);

    const { data } = await api.get<Student[]>(
      `${STUDENTS_API_URL}/available?${params}`
    );
    return data;
  },
};
