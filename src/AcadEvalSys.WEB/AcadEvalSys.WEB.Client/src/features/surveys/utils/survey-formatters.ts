import { SurveyStatus } from "../models/survey-types";
// Definir QuestionType localmente
type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'OpenText';

export function getSurveyStatusLabel(status: SurveyStatus): string {
  switch (status) {
    case SurveyStatus.Draft:
      return 'Borrador';
    case SurveyStatus.Scheduled:
      return 'Programada';
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
    case 'SingleChoice':
      return 'Opción única';
    case 'MultipleChoice':
      return 'Opción múltiple';
    case 'OpenText':
      return 'Texto libre';
    default:
      return 'Desconocido';
  }
}

export function getQuestionTypeIcon(type: QuestionType): string {
  switch (type) {
    case 'SingleChoice':
      return '🔘';
    case 'MultipleChoice':
      return '☑️';
    case 'OpenText':
      return '📝';
    default:
      return '❓';
  }
}


