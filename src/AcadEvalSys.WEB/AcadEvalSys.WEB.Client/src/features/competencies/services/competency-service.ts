import { createCrudService } from "@/infrastructure/query/axios";

// ============================================
// TIPOS
// ============================================

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

export type CompetencyFormData = {
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

// ============================================
// HELPERS
// ============================================

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

// ============================================
// SERVICIO CRUD BASE
// ============================================

const baseCrudService = createCrudService<
  CompetencyDto,
  CreateCompetencyRequest,
  CreateCompetencyRequest
>("/competencies");

// ============================================
// SERVICIO EXPORTADO (con transformación de datos)
// ============================================

export const competencyService = {
  getAll: baseCrudService.getAll,
  getById: baseCrudService.getById,
  remove: baseCrudService.remove,

  // Create y Update necesitan transformar el FormData
  async create(body: CompetencyFormData) {
    return baseCrudService.create(toRequestBody(body));
  },

  async update(id: string, body: CompetencyFormData) {
    return baseCrudService.update(id, toRequestBody(body));
  },
};

// Exports individuales para compatibilidad
export const getCompetencies = competencyService.getAll;
export const getCompetencyById = competencyService.getById;
export const createCompetency = competencyService.create;
export const updateCompetency = competencyService.update;
export const deleteCompetency = competencyService.remove;

