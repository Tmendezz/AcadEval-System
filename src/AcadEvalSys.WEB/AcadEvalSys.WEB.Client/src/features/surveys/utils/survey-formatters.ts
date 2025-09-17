import { SurveyStatus } from "../models/survey-types";
// Definir QuestionType localmente
type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'OpenText';

export function getSurveyStatusLabel(status: SurveyStatus | string | number): string {
  // Convertir string a enum número si es necesario
  let statusNum: number;
  if (typeof status === 'string') {
    switch (status) {
      case 'Draft': statusNum = 0; break;
      case 'Scheduled': statusNum = 1; break;
      case 'Published': statusNum = 2; break;
      case 'Closed': statusNum = 3; break;
      case 'Archived': statusNum = 4; break;
      default: return 'Desconocido';
    }
  } else {
    statusNum = Number(status);
  }

  switch (statusNum) {
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


