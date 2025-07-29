import {
  Competency,
  TechnicalCareer,
  Evaluation,
  EvaluationCareerAssignment,
  EvaluationAssignment,
  CompetencyLevel,
  CareerYear,
} from "@/shared/types";

// Simplified Career interface using Pick utility type
export type Career = Pick<TechnicalCareer, "id" | "name">;

export type AssignmentsByYear = {
  [key in CareerYear]: EvaluationAssignment[];
};

export type {
  Competency,
  TechnicalCareer,
  Evaluation,
  EvaluationCareerAssignment,
  EvaluationAssignment,
  CompetencyLevel,
  CareerYear,
};
