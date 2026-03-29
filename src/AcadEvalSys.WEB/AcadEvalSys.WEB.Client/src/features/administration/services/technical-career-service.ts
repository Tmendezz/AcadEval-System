import { api } from "@infrastructure/query/axios";
import type {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
} from "../../careers/models/technical-career";

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
    try {
      const { data } = await api.post<{ id: string }>(
        TECHNICAL_CAREERS_API_URL,
        career
      );
      return data.id;
    } catch (error: any) {
      // Si el servidor responde 201, consideramos que es un éxito
      if (error.response?.status === 201) {
        return error.response.data?.id || '';
      }
      throw error;
    }
  },

  async update(
    id: string,
    career: UpdateTechnicalCareerRequest
  ): Promise<void> {
    // El backend espera solo { name } en el payload, no incluir id
    const payload = {
      name: career.name
    };
    await api.put(`${TECHNICAL_CAREERS_API_URL}/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${TECHNICAL_CAREERS_API_URL}/${id}`);
  },
};
