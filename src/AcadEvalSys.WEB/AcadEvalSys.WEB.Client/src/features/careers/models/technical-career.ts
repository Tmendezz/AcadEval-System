
export interface TechnicalCareer {
  id: string;
  name: string;
  totalStudents: number;
  totalProfessors: number;
}

// Requests
export interface CreateTechnicalCareerRequest {
  name: string;
}

export interface UpdateTechnicalCareerRequest {
  id?: string;
  name: string;
}

// Tipos específicos del feature (formularios/UI)
export interface CareerFormData {
  name: string;
}

export interface CareerWithStats extends TechnicalCareer {
  studentsCount?: number;
  subjectsCount?: number;
  coordinatorName?: string;
}
