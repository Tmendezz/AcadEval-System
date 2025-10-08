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
    // El backend espera solo { name } en el payload, no incluir id
    const payload = {
      name: career.name
    };
    console.log('🔍 TechnicalCareer Service - Update request:', {
      url: `${TECHNICAL_CAREERS_API_URL}/${id}`,
      payload
    });
    await api.put(`${TECHNICAL_CAREERS_API_URL}/${id}`, payload);
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
    // El backend espera AssignCoordinatorCommand: { technicalCareerId, userId }
    const payload = {
      technicalCareerId: careerId,
      userId: coordinatorUserId
    };
    
    const url = `${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`;
    
    console.log('🔍 TechnicalCareer - assignCoordinator:', {
      url,
      payload,
      careerId,
      coordinatorUserId,
      method: 'PUT'
    });
    
    // Endpoint correcto: PUT /technical-careers/{id}/coordinator
    await api.put(url, payload);
  },

  async removeCoordinator(careerId: string): Promise<void> {
    await api.delete(`${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`);
  },
};
