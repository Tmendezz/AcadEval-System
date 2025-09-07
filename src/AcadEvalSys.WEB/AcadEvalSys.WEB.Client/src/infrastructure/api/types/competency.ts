export interface Competency {
  id: string;
  name: string;
  description: string;
  type: "Technical" | "Soft";
  levels?: CompetencyLevelDescription[];
}

export interface CompetencyLevelDescription {
  level: "Inicial" | "Intermedio" | "Avanzado" | "Excelente" | "Ninguno";
  description: string;
}

export interface CompetencyLevel {
  level: "Inicial" | "Intermedio" | "Avanzado" | "Excelente" | "Ninguno";
  description: string;
}

export type CompetencyLevelDescriptions = {
  [key in CompetencyLevel["level"]]: string;
};

export type CompetencyRequest = Omit<Competency, "id">;
export type CreateCompetencyRequest = CompetencyRequest;
export type UpdateCompetencyRequest = CompetencyRequest;
