import { api } from "@/shared/config/axios";
import { EvaluationFormData } from "../types/evaluation-form";

const EVALUATIONS_API_URL = "/evaluation-instances";

export const getEvaluations = async () => {
  const { data } = await api.get(EVALUATIONS_API_URL);
  return data;
};

export const getEvaluationById = async (id: string) => {
  const { data } = await api.get(`${EVALUATIONS_API_URL}/${id}`);
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
        year
      }
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

