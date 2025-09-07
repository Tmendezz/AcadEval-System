// Import types from infrastructure
import type {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
} from "@infrastructure/api/types/technical-career";

// Re-export types from infrastructure that are used by this feature
export type {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
};

// Feature-specific types for careers
export interface CareerFormData {
  name: string;
  description: string;
  coordinatorId?: string;
}

export interface CareerWithStats extends TechnicalCareer {
  studentsCount: number;
  subjectsCount: number;
  coordinatorName?: string;
}
