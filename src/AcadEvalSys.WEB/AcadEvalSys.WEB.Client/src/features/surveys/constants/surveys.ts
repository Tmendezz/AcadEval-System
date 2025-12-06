import { SurveyFormData } from "../types/surveys";

export const initialFormData: SurveyFormData = {
  title: "",
  description: "",
  type: "student_evaluation",
  targetAudience: "students",
  questions: [],
};

export const defaultSurveyStats = {
  totalSurveys: 0,
  activeSurveys: 0,
  totalResponses: 0,
  averageCompletionRate: 0,
};

export const DEFAULT_TOTAL_TARGET_USERS = 100;

export const TEXT_RESPONSE_MAX_LENGTH = 1000;


