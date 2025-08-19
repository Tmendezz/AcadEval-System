import { api } from "@/shared/config/axios";
import {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
} from "../types/technical-career";
import { ImportStudentsResult, CreateStudentRequest } from "../types";

const TECHNICAL_CAREERS_API_URL = "/technical-careers";

export const technicalCareerService = {
  async getAll(): Promise<TechnicalCareer[]> {
    const { data } = await api.get<TechnicalCareer[]>(
      TECHNICAL_CAREERS_API_URL
    );
    return data;
  },

  async getById(id: string): Promise<TechnicalCareer> {
    const { data } = await api.get<TechnicalCareer>(
      `${TECHNICAL_CAREERS_API_URL}/${id}`
    );
    return data;
  },

  async create(career: CreateTechnicalCareerRequest): Promise<string> {
    const { data } = await api.post<{ id: string }>(
      TECHNICAL_CAREERS_API_URL,
      career
    );
    return data.id;
  },

  async update(
    id: string,
    career: UpdateTechnicalCareerRequest
  ): Promise<void> {
    await api.put(`${TECHNICAL_CAREERS_API_URL}/${id}`, career);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${TECHNICAL_CAREERS_API_URL}/${id}`);
  },

  async importStudents(
    careerId: string,
    file: File
  ): Promise<ImportStudentsResult> {
    console.log(`📂 Importing students from file to career ${careerId}`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post<ImportStudentsResult>(
        `${TECHNICAL_CAREERS_API_URL}/${careerId}/import-students`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`✅ Students imported successfully to career:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error importing students to career:`, error);
      throw error;
    }
  },

  async addStudentToCareer(
    careerId: string,
    student: CreateStudentRequest
  ): Promise<string> {
    console.log(`👨‍🎓 Adding student to career ${careerId}:`, student);

    try {
      const { data } = await api.post<{ id: string }>(
        `${TECHNICAL_CAREERS_API_URL}/${careerId}/students`,
        student
      );

      console.log(`✅ Student added successfully to career:`, data);
      return data.id;
    } catch (error) {
      console.error(`❌ Error adding student to career:`, error);
      throw error;
    }
  },
};
