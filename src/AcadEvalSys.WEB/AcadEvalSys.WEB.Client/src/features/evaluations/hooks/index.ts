// Statistics hooks
export { useEvaluationStatistics } from "./use-evaluation-statistics";
export { useEvaluationWizard } from "./use-evaluation-wizard";
export { useCareerYearData } from "./use-career-year-data";
export { useUrlMapping } from "./use-url-mapping";

// Filter hooks
export { useCompetencyFilters } from "./competencies/use-competency-filters";
export { useEvaluationFilters } from "./evaluations/use-evaluation-filters";

// Evaluation hooks
export { useGetEvaluations } from "./evaluations/queries/use-get-evaluations";
export { 
  useGetCareerYearAssignmentDetails
} from "./evaluations/queries/use-get-assignment-details";
export {
  useGetAssignmentStudents
} from "./evaluations/queries/use-get-assignment-students";

// Mutations
export { useFinalizeEvaluation } from "./evaluations/mutations/use-finalize-evaluation";

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
