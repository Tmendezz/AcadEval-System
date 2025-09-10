import { QuestionType, SurveyTemplateStatus, SurveyTemplateType } from "../models/survey-template-types";

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


