import { api } from "@infrastructure/query/axios";
import {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
} from "../models/technical-career";
import { ImportStudentsResult } from "../models/import";
import { CreateStudentRequest } from "../models/student";

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

  async getCareerCoordinator(careerId: string) {
    const { data } = await api.get(
      `${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`
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

    
      return data;
    
  },

  async addStudentToCareer(
    careerId: string,
    student: CreateStudentRequest
  ): Promise<string> {
      const { data } = await api.post<{ id: string }>(
        `${TECHNICAL_CAREERS_API_URL}/${careerId}/students`,
        { ...student, technicalCareerId: careerId }
      );
      return data.id;
  },

  async assignCoordinator(careerId: string, coordinatorUserId: string): Promise<void> {
    await api.put(`${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`, {
      coordinatorUserId,
    });
  },

  async removeCoordinator(careerId: string): Promise<void> {
    await api.delete(`${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`);
  },
};
