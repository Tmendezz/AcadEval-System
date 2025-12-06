import type {
  Survey as ModelSurvey,
  SurveyQuestion as ModelSurveyQuestion,
} from "../models/survey-types";

export type SurveyType =
  | "student_evaluation"
  | "professor_feedback"
  | "course_evaluation";

export type TargetAudience = "students" | "professors";

export interface Survey
  extends Omit<
    ModelSurvey,
    | "questions"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "publishedAt"
    | "closedAt"
  > {
  type: SurveyType;
  status: "draft" | "active" | "completed" | "archived";
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt: string;
  targetAudience: TargetAudience;
  responses: SurveyResponse[];
  responseCount?: number;
}

export interface SurveyQuestion
  extends Omit<ModelSurveyQuestion, "options" | "text"> {
  id: string;
  question: string;
  options?: string[];
  minRating?: number;
  maxRating?: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  respondentType: "student" | "professor" | "coordinator";
  answers: SurveyAnswer[];
  completedAt: string;
  isAnonymous: boolean;
}

export interface SurveyAnswer {
  questionId: string;
  value: string | number;
  textValue?: string;
}

export interface SurveyFormData {
  title: string;
  description: string;
  type: Survey["type"];
  targetAudience: Survey["targetAudience"];
  questions: Omit<SurveyQuestion, "id">[];
}


