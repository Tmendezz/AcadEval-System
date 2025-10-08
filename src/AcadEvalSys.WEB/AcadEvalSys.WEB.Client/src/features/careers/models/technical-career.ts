
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
  name: string;
  // Nota: el id va en la URL, no en el payload
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
