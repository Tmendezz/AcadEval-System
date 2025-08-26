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
    // Backend no expone /students/by-career; usamos GET /students con filtros
    const { data } = await api.get<{ students: any[]; totalCount: number }>(
      `${STUDENTS_API_URL}?${params}`
    );
    const toYearNumber = (y: any): number => {
      if (typeof y === "number") return y;
      switch (y) {
        case "First":
          return 1;
        case "Second":
          return 2;
        case "Third":
          return 3;
        default:
          return 1;
      }
    };
    return (data.students ?? []).map((s: any) => ({
      id: s.userId ?? s.id,
      name: s.name,
      email: s.email,
      currentYear: toYearNumber(s.currentYear),
      technicalCareerName: s.technicalCareerName ?? "",
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
