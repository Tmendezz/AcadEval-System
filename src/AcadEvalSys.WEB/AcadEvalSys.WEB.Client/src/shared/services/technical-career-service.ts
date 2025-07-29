import { api } from "@/shared/config/axios";
import {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
} from "@/shared/types";

const TECHNICAL_CAREERS_API_URL = "/technical-careers";

export const getTechnicalCareers = async (): Promise<TechnicalCareer[]> => {
  const { data } = await api.get<TechnicalCareer[]>(TECHNICAL_CAREERS_API_URL);
  return data;
};

export const getTechnicalCareerById = async (
  id: string
): Promise<TechnicalCareer> => {
  const { data } = await api.get<TechnicalCareer>(
    `${TECHNICAL_CAREERS_API_URL}/${id}`
  );
  return data;
};

export const createTechnicalCareer = async (
  career: CreateTechnicalCareerRequest
): Promise<void> => {
  await api.post(TECHNICAL_CAREERS_API_URL, career);
};

export const updateTechnicalCareer = async (
  id: string,
  career: UpdateTechnicalCareerRequest
): Promise<void> => {
  await api.put(`${TECHNICAL_CAREERS_API_URL}/${id}`, career);
};

export const deleteTechnicalCareer = async (id: string): Promise<void> => {
  await api.delete(`${TECHNICAL_CAREERS_API_URL}/${id}`);
};
