import { SurveyTemplateStatus, SurveyTemplateType } from "../models/survey-template-types";

// Definir QuestionType localmente
type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'OpenText';

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


