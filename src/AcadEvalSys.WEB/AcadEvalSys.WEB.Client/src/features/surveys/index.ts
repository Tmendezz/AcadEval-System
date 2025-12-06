// Páginas públicas (route-level)
export { default as CreateSurveyPage } from "./pages/create-survey-page";
export { default as EditSurveyPage } from "./pages/edit-survey-page";
export { default as SurveysPage } from "./pages/surveys-page";
export { default as CreateTemplatePage } from "./pages/create-template-page";
export { default as EditTemplatePage } from "./pages/edit-template-page";

// API pública mínima
export * from './hooks/use-survey-templates';
export * from './hooks/use-surveys';
export type { SurveyStatus, Survey, SurveyListItem, SurveyForm, SurveyFilters, SurveyOption, SurveyQuestion } from './models/survey-types';
export * from './models/survey-template-types';
export { getSurveyStatusLabel } from './utils/survey-formatters';
export { getSurveyTemplateTypeLabel, getSurveyTemplateStatusLabel } from './utils/survey-template-formatters';
