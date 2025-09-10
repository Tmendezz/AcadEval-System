export enum SurveyStatus {
  Draft = 0,
  Published = 1,
  Closed = 2,
  Archived = 3,
}

export enum QuestionType {
  SingleChoice = 0,
  MultipleChoice = 1,
  OpenText = 2,
}

export interface SurveyOption {
  text: string;
  order: number;
}

export interface SurveyQuestion {
  text: string;
  type: QuestionType;
  order: number;
  required: boolean;
  options: SurveyOption[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  questions: SurveyQuestion[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  closedAt?: Date;
}

export interface SurveyListItem {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  questionsCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  closedAt?: Date;
}

export interface SurveyForm {
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface SurveyFilters {
  status?: SurveyStatus;
  search?: string;
  createdBy?: string;
}

// Utility functions
export function getSurveyStatusLabel(status: SurveyStatus): string {
  switch (status) {
    case SurveyStatus.Draft:
      return 'Borrador';
    case SurveyStatus.Published:
      return 'Publicada';
    case SurveyStatus.Closed:
      return 'Cerrada';
    case SurveyStatus.Archived:
      return 'Archivada';
    default:
      return 'Desconocido';
  }
}

export function getQuestionTypeLabel(type: QuestionType): string {
  switch (type) {
    case QuestionType.SingleChoice:
      return 'Opción única';
    case QuestionType.MultipleChoice:
      return 'Opción múltiple';
    case QuestionType.OpenText:
      return 'Texto libre';
    default:
      return 'Desconocido';
  }
}

export function getQuestionTypeIcon(type: QuestionType): string {
  switch (type) {
    case QuestionType.SingleChoice:
      return '🔘';
    case QuestionType.MultipleChoice:
      return '☑️';
    case QuestionType.OpenText:
      return '📝';
    default:
      return '❓';
  }
}
