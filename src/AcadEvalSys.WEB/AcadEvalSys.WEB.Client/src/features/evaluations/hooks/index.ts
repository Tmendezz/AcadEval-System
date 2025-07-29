// Statistics hooks
export { useEvaluationStatistics } from "./use-evaluation-statistics";
export { useEvaluationWizard } from "./use-evaluation-wizard";

// Filter hooks
export { useCompetencyFilters } from "./competencies/use-competency-filters";
export { useEvaluationFilters } from "./evaluations/use-evaluation-filters";

// Evaluation hooks
export { useGetEvaluations } from "./evaluations/queries/use-get-evaluations";

// Shared hooks (re-export from shared)
export {
  useCompetencies,
  useCompetencyById,
} from "@/shared/hooks/use-competencies";
export {
  useTechnicalCareers,
  useTechnicalCareerById,
} from "@/shared/hooks/use-technical-careers";
export {
  useSubjectsByCareer,
  useSubjectById,
} from "@/shared/hooks/use-subjects";
export { useProfessors, useProfessorById } from "@/shared/hooks/use-professors";
