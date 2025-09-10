// Main container component - follows Screaming Architecture
export { default as Surveys } from "./surveys";

// Individual pages
export { default as CreateSurveyPage } from "./pages/create-survey-page";
export { default as EditSurveyPage } from "./pages/edit-survey-page";
export { default as SurveysPage } from "./pages/surveys-page";


// Components
export { SurveyTemplates } from './components/survey-templates';
export { SurveyList } from './components/SurveyList';
export { TemplateList } from './components/template-list';
export { TemplatePreview } from './components/template-preview';
export { SurveyBasicInfo } from './components/survey-basic-info';
export { SurveyBasicInfoForm } from './components/survey-basic-info-form';
export { SurveyQuestionsEditor } from './components/survey-questions-editor';
export { SurveyFormActions } from './components/survey-form-actions';
export { SurveyFormActionsBasic } from './components/survey-form-actions-basic';

// Hooks
export * from './hooks/use-survey-templates';
export * from './hooks/use-surveys';
export * from './hooks/use-survey-form-validation';
export * from './hooks/use-survey-form-validation-basic';

// Services
export { surveyTemplateService } from './services/survey-template-service';
export { surveyService } from './services/survey-service';

// Types
export * from './models/survey-template-types';
export type { 
  SurveyStatus, 
  Survey, 
  SurveyListItem, 
  SurveyForm, 
  SurveyFilters, 
  SurveyOption, 
  SurveyQuestion
} from './models/survey-types';
export { getSurveyStatusLabel } from './models/survey-types';
