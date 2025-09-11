import { SurveyStatus } from "../models/survey-types";
import { QuestionType } from "../models/survey-template-types";

export function getSurveyStatusLabel(status: SurveyStatus): string {
  switch (status) {
    case SurveyStatus.Draft:
      return 'Borrador';
    case SurveyStatus.Published:
      return 'Publicada';
    case SurveyStatus.Closed:
      return 'Cerrada';
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


