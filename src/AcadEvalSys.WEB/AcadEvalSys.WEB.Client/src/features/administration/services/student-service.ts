import { api } from "@infrastructure/query/axios";
import { userManagementService } from "./user-management-service";

export interface Student {
  id: string;
  name: string;
  email: string;
  currentYear: number;
  technicalCareerId: string;
  technicalCareerName: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentFormValues {
  name: string;
  email: string;
  password?: string;
  currentYear: number;
  technicalCareerId: string;
}

export interface StudentsResponse {
  items: Student[];
  totalItemsCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
}

const STUDENTS_API_URL = "students";

export const studentService = {
  async getAll(
    pageNumber = 1,
    pageSize = 50,
    searchTerm?: string,
    technicalCareerId?: string,
    currentYear?: number
  ): Promise<StudentsResponse> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) params.append("searchTerm", searchTerm);
    if (technicalCareerId)
      params.append("technicalCareerId", technicalCareerId);
    if (currentYear) params.append("currentYear", currentYear.toString());

    const { data } = await api.get(`${STUDENTS_API_URL}?${params}`);
    return data;
  },

  async getById(id: string): Promise<Student> {
    const { data } = await api.get(`${STUDENTS_API_URL}/${id}`);
    return data;
  },

  async create(values: StudentFormValues): Promise<string> {
    const { data } = await api.post(STUDENTS_API_URL, values);
    return data;
  },

  async update(
    id: string,
    values: Partial<StudentFormValues>
  ): Promise<string> {
    // Map frontend values to backend command structure
    const updateCommand = {
      name: values.name,
      email: values.email,
      technicalCareerId: values.technicalCareerId,
      currentYear: values.currentYear,
    };
    
    const { data } = await api.put(`${STUDENTS_API_URL}/${id}`, updateCommand);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${STUDENTS_API_URL}/${id}`);
  },

  /**
   * Cambia la contraseña de un estudiante
   * @deprecated Usar userManagementService.changePassword directamente
   */
  async changePassword(id: string, newPassword: string): Promise<void> {
    return userManagementService.changePassword(id, newPassword);
  },

  /**
   * Genera una contraseña temporal para un estudiante
   */
  async generateTemporaryPassword(id: string) {
    return userManagementService.generateTemporaryPassword(id);
  },
};
