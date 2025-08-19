import { api } from "@/shared/config/axios";
import {
  Competency,
  CreateCompetencyRequest,
  UpdateCompetencyRequest,
} from "@/shared/types/competency";

const COMPETENCIES_API_URL = "/competencies";

export const getCompetencies = async (): Promise<Competency[]> => {
  const { data } = await api.get<Competency[]>(COMPETENCIES_API_URL);
  return data;
};

export const getCompetencyById = async (
  id: string
): Promise<Competency | null> => {
  const { data } = await api.get<Competency>(`${COMPETENCIES_API_URL}/${id}`);
  return data;
};

export const createCompetency = async (
  competency: CreateCompetencyRequest
): Promise<void> => {
  await api.post(COMPETENCIES_API_URL, competency);
};

export const updateCompetency = async (
  id: string,
  competency: UpdateCompetencyRequest
): Promise<void> => {
  await api.put(`${COMPETENCIES_API_URL}/${id}`, competency);
};

export const deleteCompetency = async (id: string): Promise<void> => {
  await api.delete(`${COMPETENCIES_API_URL}/${id}`);
};
