// Union Types (más escalables y mantenibles)
export type SurveyTemplateType = 'Student' | 'Professor';
export type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'OpenText';
export type SurveyTemplateStatus = 'Draft' | 'Scheduled' | 'Published' | 'Closed' | 'Archived';

// Re-export para compatibilidad
export type { QuestionType as QuestionTypeEnum };

// Constantes para compatibilidad y validación
export const SURVEY_TEMPLATE_TYPES = {
  Student: 'Student' as const,
  Professor: 'Professor' as const,
} as const;

export const QUESTION_TYPES = {
  SingleChoice: 'SingleChoice' as const,
  MultipleChoice: 'MultipleChoice' as const,
  OpenText: 'OpenText' as const,
} as const;

export const SURVEY_TEMPLATE_STATUSES = {
  Draft: 'Draft' as const,
  Scheduled: 'Scheduled' as const,
  Published: 'Published' as const,
  Closed: 'Closed' as const,
  Archived: 'Archived' as const,
} as const;

// Tipos de dominio
export interface SurveyTemplateOption {
  id?: string;
  text: string;
  value: string;
  order: number;
  allowOpenText?: boolean;
}

export interface SurveyTemplateQuestion {
  id?: string;
  text: string;
  type: QuestionType;
  order: number;
  required: boolean;
  allowComment?: boolean;
  options: SurveyTemplateOption[];
}

export interface SurveyTemplate {
  id: string;
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  version: number;
  status: SurveyTemplateStatus;
  createdAt: string;
  updatedAt?: string;
  questions: SurveyTemplateQuestion[];
}

export interface SurveyTemplateListItem {
  id: string;
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  version: number;
  status: SurveyTemplateStatus;
  createdAt: string;
  updatedAt?: string;
  questionCount: number;
}

export interface SurveyTemplateForm {
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  questions: SurveyTemplateQuestion[];
}

export interface SurveyTemplateFilters {
  searchTerm?: string;
  surveyType?: SurveyTemplateType;
  isDraft?: boolean;
}

export interface CreateSurveyTemplateRequest {
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  questions: SurveyTemplateQuestion[];
}

export interface UpdateSurveyTemplateRequest {
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  rowVersion?: string;
  questions: SurveyTemplateQuestion[];
}

// Utilidades con union types
export const getSurveyTemplateTypeLabel = (type: SurveyTemplateType): string => {
  switch (type) {
    case 'Student':
      return 'Estudiantes';
    case 'Professor':
      return 'Profesores';
    default:
      return 'Desconocido';
  }
};

export const getQuestionTypeLabel = (type: QuestionType): string => {
  switch (type) {
    case 'SingleChoice':
      return 'Opción única';
    case 'MultipleChoice':
      return 'Múltiple opción';
    case 'OpenText':
      return 'Texto abierto';
    default:
      return 'Desconocido';
  }
};

export const getQuestionTypeIcon = (type: QuestionType): string => {
  switch (type) {
    case 'SingleChoice':
      return 'radio_button_checked';
    case 'MultipleChoice':
      return 'check_box';
    case 'OpenText':
      return 'text_fields';
    default:
      return 'help';
  }
};

export const getSurveyTemplateStatusLabel = (status: SurveyTemplateStatus): string => {
  switch (status) {
    case 'Draft':
      return 'Borrador';
    case 'Scheduled':
      return 'Programada';
    case 'Published':
      return 'Publicada';
    case 'Closed':
      return 'Cerrada';
    case 'Archived':
      return 'Archivada';
    default:
      return 'Desconocido';
  }
};

