// Enums
export enum SurveyTemplateType {
  Student = 0,
  Professor = 1,
}

export enum QuestionType {
  SingleChoice = 0,
  MultipleChoice = 1,
  OpenText = 2,
}

export enum SurveyTemplateStatus {
  Draft = 0,
  Scheduled = 1,
  Published = 2,
  Closed = 3,
  Archived = 4,
}

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
  name: string;
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

// Utilidades
export const getSurveyTemplateTypeLabel = (type: SurveyTemplateType): string => {
  switch (type) {
    case SurveyTemplateType.Student:
      return 'Estudiantes';
    case SurveyTemplateType.Professor:
      return 'Profesores';
    default:
      return 'Desconocido';
  }
};

export const getQuestionTypeLabel = (type: QuestionType): string => {
  switch (type) {
    case QuestionType.SingleChoice:
      return 'Opción única';
    case QuestionType.MultipleChoice:
      return 'Múltiple opción';
    case QuestionType.OpenText:
      return 'Texto abierto';
    default:
      return 'Desconocido';
  }
};

export const getQuestionTypeIcon = (type: QuestionType): string => {
  switch (type) {
    case QuestionType.SingleChoice:
      return 'radio_button_checked';
    case QuestionType.MultipleChoice:
      return 'check_box';
    case QuestionType.OpenText:
      return 'text_fields';
    default:
      return 'help';
  }
};

export const getSurveyTemplateStatusLabel = (status: SurveyTemplateStatus): string => {
  switch (status) {
    case SurveyTemplateStatus.Draft:
      return 'Borrador';
    case SurveyTemplateStatus.Scheduled:
      return 'Programada';
    case SurveyTemplateStatus.Published:
      return 'Publicada';
    case SurveyTemplateStatus.Closed:
      return 'Cerrada';
    case SurveyTemplateStatus.Archived:
      return 'Archivada';
    default:
      return 'Desconocido';
  }
};

