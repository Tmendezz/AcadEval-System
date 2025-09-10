// Enums para Survey Templates
export enum SurveyTemplateType {
  Student = "Student",
  Professor = "Professor",
  SelfEvaluation = "SelfEvaluation"
}

export enum QuestionType {
  MultipleChoice = "MultipleChoice",
  Scale = "Scale",
  Text = "Text",
  YesNo = "YesNo"
}

// Interfaces base
export interface SurveyTemplateQuestion {
  id: string;
  text: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  options?: SurveyTemplateQuestionOption[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
}

export interface SurveyTemplateQuestionOption {
  id: string;
  text: string;
  value: number;
  order: number;
}

export interface SurveyTemplate {
  id: string;
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  questions: SurveyTemplateQuestion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// DTOs para requests
export interface CreateSurveyTemplateRequest {
  name: string;  // Backend espera 'name', no 'title'
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  questions: CreateSurveyTemplateQuestionRequest[];
}

export interface CreateSurveyTemplateQuestionRequest {
  text: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  options?: CreateSurveyTemplateQuestionOptionRequest[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
}

export interface CreateSurveyTemplateQuestionOptionRequest {
  text: string;
  value: number;
  order: number;
}

export interface UpdateSurveyTemplateRequest {
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  questions: UpdateSurveyTemplateQuestionRequest[];
}

export interface UpdateSurveyTemplateQuestionRequest {
  id?: string;
  text: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  options?: UpdateSurveyTemplateQuestionOptionRequest[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
}

export interface UpdateSurveyTemplateQuestionOptionRequest {
  id?: string;
  text: string;
  value: number;
  order: number;
}

// Filtros para listado
export interface SurveyTemplatesFilters {
  surveyType?: SurveyTemplateType;
  isDraft?: boolean;
  searchTerm?: string;
}

// Labels para mostrar en la UI
export const SurveyTemplateTypeLabels: Record<SurveyTemplateType, string> = {
  [SurveyTemplateType.Student]: "Evaluación de Estudiante",
  [SurveyTemplateType.Professor]: "Evaluación de Profesor", 
  [SurveyTemplateType.SelfEvaluation]: "Autoevaluación"
};

export const QuestionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.MultipleChoice]: "Opción Múltiple",
  [QuestionType.Scale]: "Escala",
  [QuestionType.Text]: "Texto Libre",
  [QuestionType.YesNo]: "Sí/No"
};
