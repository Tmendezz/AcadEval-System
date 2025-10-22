// Models and types for the evaluations feature

// Export main evaluation types
export type {
  Evaluation,
  EvaluationStatus,
  ProfessorAssignmentStatus,
  Semester,
  CompetencyAssignmentDto,
  CompetencyAssignmentByCareerYearDto
} from "./evaluation";

// Export evaluation form types
export type {
  EvaluationFormData,
  CareerSubject,
  WizardStep,
  Assignment,
  AssignmentWithSubject,
  CareerAssignment,
  Competency,
  Subject,
  TechnicalCareer
} from "./evaluation-form";

// Export auxiliary types
export type {
  Career,
  CareerYear,
  CompetencyLevel,
  EvaluationAssignment,
  EvaluationCareerAssignment,
  AssignmentsByYear
} from "./types";

// Professor evaluation models moved to professor-evaluations feature
