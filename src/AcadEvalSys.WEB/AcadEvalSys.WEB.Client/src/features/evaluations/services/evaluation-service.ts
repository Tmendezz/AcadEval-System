import { api } from "@/infrastructure/query/axios";

export type EvaluationListItem = {
  id: string;
  title: string;
  status: "Draft" | "Published" | "Completed" | "Archived" | "Pending";
  createdAt: string;
  updatedAt?: string;
  periodFrom?: string;
  periodTo?: string;
};

export async function getEvaluations(): Promise<EvaluationListItem[]> {
  const { data } = await api.get<EvaluationListItem[]>(`/evaluation-instances`);
  return data;
}

export async function getEvaluationById(id: string) {
  const { data } = await api.get(`/evaluation-instances/${id}`);
  return data;
}

export async function createEvaluation(body: any) {
  const { data } = await api.post<{ id: string }>(`/evaluation-instances`, body);
  return data.id;
}

export async function deleteEvaluation(id: string) {
  await api.delete(`/evaluation-instances/${id}`);
}

export async function finalizeEvaluation(id: string) {
  await api.post(`/evaluation-instances/${id}/finalize`, {});
}

export async function getCareerYearAssignmentDetails(
  evaluationId: string,
  careerId: string,
  year: number
) {
  const { data } = await api.get(
    `/evaluation-instances/${evaluationId}/career-assignments`,
    { params: { careerId, year: String(year) } }
  );
  return data;
}

export async function getAssignmentStudents(assignmentId: string) {
  const { data } = await api.get(`/evaluation-instances/assignments/${assignmentId}/students`);
  return data;
}


