import { api } from "@infrastructure/query/axios";
import { PagedResult } from "@infrastructure/api/types/common";

const SURVEYS_API_URL = "/surveys";

export interface SurveyListItem {
  id: string;
  title: string;
  description: string;
  status: "Draft" | "Published" | "Closed";
  createdAt: string;
  responseCount: number;
}

export const getSurveys = async (): Promise<PagedResult<SurveyListItem>> => {
  const { data } = await api.get<PagedResult<SurveyListItem>>(SURVEYS_API_URL);
  return data;
};
