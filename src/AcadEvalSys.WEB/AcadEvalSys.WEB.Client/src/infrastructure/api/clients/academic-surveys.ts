import { api } from "@/infrastructure/query/axios";

export interface SubmitAnswerDto {
  questionId: string;
  value?: string; // single
  values?: string[]; // multi
  text?: string; // open text
}

export async function getSurveyById(id: string) {
  const { data } = await api.get(`/surveys/${id}`);
  return data;
}

export async function submitSurveySubjectResponse(surveySubjectId: string, answers: SubmitAnswerDto[]) {
  const { data } = await api.post(`/surveys/subjects/${surveySubjectId}/responses`, { answers });
  return data as { id: string };
}


