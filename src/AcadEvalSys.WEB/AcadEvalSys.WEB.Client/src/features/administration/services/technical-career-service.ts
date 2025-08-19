import { api } from "@/shared/config/axios";
import type {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
} from "@/shared/types/technical-career";

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
};
