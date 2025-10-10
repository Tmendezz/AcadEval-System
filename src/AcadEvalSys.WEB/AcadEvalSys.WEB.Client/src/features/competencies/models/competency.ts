export interface CompetencyLevel {
  level: string;
  description: string;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  type: "Soft" | "Technical";
  levels?: CompetencyLevel[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompetencyRequest {
  name: string;
  description: string;
  type: "Soft" | "Technical";
  competencyLevelDescriptions?: Record<string, string>;
}

export interface UpdateCompetencyRequest extends CreateCompetencyRequest {
  id: string;
}

export interface CompetencyFormData {
  name: string;
  description: string;
  type: "Soft" | "Technical";
  levels?: {
    Inicial: string;
    Intermedio: string;
    Avanzado: string;
    Excelente: string;
  };
}

export type CompetencyType = "Soft" | "Technical";

export const CompetencyTypes = {
  Soft: "Soft" as const,
  Technical: "Technical" as const,
} as const;
