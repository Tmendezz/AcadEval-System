import { api } from "@infrastructure/query/axios";
import { Student } from "@infrastructure/api/types/student";

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

    // El backend retorna PagedResult<StudentDto>
    const { data } = await api.get<{
      items: Student[];
      totalItemsCount: number;
    }>(`${STUDENTS_API_URL}?${params}`);

    return {
      students: data.items ?? [],
      totalCount: data.totalItemsCount ?? 0,
    };
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

    // El backend retorna PagedResult<StudentDto>
    const { data } = await api.get<{
      items: {
        id: string;
        name: string;
        email: string;
        currentYear: number;
        technicalCareerName?: string;
      }[];
      totalItemsCount: number;
    }>(`${STUDENTS_API_URL}?${params}`);

    return (data.items ?? []).map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      currentYear: student.currentYear,
      technicalCareerName: student.technicalCareerName ?? "",
    }));
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
