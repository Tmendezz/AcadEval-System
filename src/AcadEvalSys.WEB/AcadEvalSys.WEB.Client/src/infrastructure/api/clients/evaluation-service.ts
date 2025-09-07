import { api } from "@infrastructure/query/axios";
import { PagedResult } from "@infrastructure/api/types/common";
import { Evaluation } from "@infrastructure/api/types/evaluation";
import { EvaluationFormData } from "@features/evaluations/models/evaluation-form";

const EVALUATIONS_API_URL = "/evaluation-instances";

export interface EvaluationListItem {
  id: string;
  title: string;
  description: string;
  status: "Draft" | "Published" | "Completed" | "Archived";
  startDate: string;
  endDate: string;
  careersCount: number;
  competenciesCount: number;
  professorsCount: number;
  studentsCount: number;
  completionPercentage: number;
}

export const getEvaluations = async (): Promise<
  PagedResult<EvaluationListItem>
> => {
  const { data } = await api.get<PagedResult<EvaluationListItem>>(
    EVALUATIONS_API_URL
  );
  return data;
};

export const getEvaluationById = async (id: string): Promise<Evaluation> => {
  const { data } = await api.get<Evaluation>(`${EVALUATIONS_API_URL}/${id}`);
  return data;
};

export const createEvaluation = async (evaluation: EvaluationFormData) => {
  const { data } = await api.post(EVALUATIONS_API_URL, evaluation);
  return data;
};

export const updateEvaluation = async (
  id: string,
  evaluation: {
    id: string;
    title: string;
    description: string;
    periodFrom: string;
    periodTo: string;
  }
) => {
  await api.put(`${EVALUATIONS_API_URL}/${id}`, evaluation);
};

export const deleteEvaluation = async (id: string) => {
  await api.delete(`${EVALUATIONS_API_URL}/${id}`);
};

export const finalizeEvaluation = async (id: string, forceClose = false) => {
  const { data } = await api.post(
    `${EVALUATIONS_API_URL}/${id}/finalize?forceClose=${forceClose}`
  );
  return data;
};

export const getCareerYearAssignmentDetails = async (
  evaluationId: string,
  careerId: string,
  year: string
) => {
  const { data } = await api.get(
    `${EVALUATIONS_API_URL}/${evaluationId}/career-assignments`,
    {
      params: {
        careerId,
        year,
      },
    }
  );
  return data;
};

export const getAssignmentStudents = async (assignmentId: string) => {
  const { data } = await api.get(
    `${EVALUATIONS_API_URL}/assignments/${assignmentId}/students`
  );
  return data;
};
