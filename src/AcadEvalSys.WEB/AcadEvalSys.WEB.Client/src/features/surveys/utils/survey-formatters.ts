import { SurveyStatus, QuestionType } from "../models/survey-types";

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


