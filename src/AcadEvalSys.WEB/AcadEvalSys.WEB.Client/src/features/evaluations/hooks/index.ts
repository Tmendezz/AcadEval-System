// Statistics hooks
export { useEvaluationStatistics } from "./use-evaluation-statistics";
export { useEvaluationWizard } from "./use-evaluation-wizard";
export { useCareerYearData } from "./use-career-year-data";

// Filter hooks
export { useEvaluationFilters } from "./evaluations/use-evaluation-filters";

// Evaluation hooks
export { useGetEvaluations } from "./evaluations/queries/use-get-evaluations";
export { useGetEvaluationById } from "./use-get-evaluation-by-id";
export { useGetCareerYearAssignmentDetails } from "./evaluations/queries/use-get-assignment-details";
export { useGetAssignmentStudents } from "./evaluations/queries/use-get-assignment-students";

// Mutations
export { useFinalizeEvaluation } from "./evaluations/mutations/use-finalize-evaluation";
export { useDeleteEvaluation } from "./evaluations/mutations/use-delete-evaluation";

// Professor evaluation hooks moved to professor-evaluations feature

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
