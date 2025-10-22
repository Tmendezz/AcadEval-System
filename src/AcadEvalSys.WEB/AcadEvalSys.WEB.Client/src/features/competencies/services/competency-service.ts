import { api } from "@/infrastructure/query/axios";

export interface CompetencyDto {
  id: string;
  name: string;
  description: string;
  type: "Soft" | "Technical";
  levels?: { level: string; description: string }[];
}

export interface CreateCompetencyRequest {
  name: string;
  description: string;
  type: "Soft" | "Technical";
  competencyLevelDescriptions?: Record<string, string>;
}

export interface UpdateCompetencyRequest extends CreateCompetencyRequest {}

type CompetencyFormData = {
  name: string;
  description: string;
  type: "Soft" | "Technical";
  levels?: {
    Inicial: string;
    Intermedio: string;
    Avanzado: string;
    Excelente: string;
  };
};

function toRequestBody(body: CompetencyFormData): CreateCompetencyRequest {
  const request: CreateCompetencyRequest = {
    name: body.name,
    description: body.description,
    type: body.type,
  };
  if (body.levels) {
    request.competencyLevelDescriptions = {
      Inicial: body.levels.Inicial,
      Intermedio: body.levels.Intermedio,
      Avanzado: body.levels.Avanzado,
      Excelente: body.levels.Excelente,
    };
  }
  return request;
}

export async function getCompetencies() {
  const { data } = await api.get<CompetencyDto[]>(`/competencies`);
  return data;
}

export async function getCompetencyById(id: string) {
  const { data } = await api.get<CompetencyDto>(`/competencies/${id}`);
  return data;
}

export async function createCompetency(body: CompetencyFormData) {
  const payload = toRequestBody(body);
  const { data } = await api.post(`/competencies`, payload);
  return data as { id: string } | null;
}

export async function updateCompetency(
  id: string,
  body: CompetencyFormData
) {
  const payload = toRequestBody(body);
  await api.put(`/competencies/${id}`, payload);
}

export async function deleteCompetency(id: string) {
  await api.delete(`/competencies/${id}`);
}


