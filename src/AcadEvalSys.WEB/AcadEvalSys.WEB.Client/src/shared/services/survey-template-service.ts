import { api } from "@/shared/config/axios";
import {
  SurveyTemplate,
  CreateSurveyTemplateRequest,
  UpdateSurveyTemplateRequest,
  SurveyTemplatesFilters
} from "@/shared/types";

const SURVEY_TEMPLATES_API_URL = "/survey-templates";

export const getSurveyTemplates = async (
  filters?: SurveyTemplatesFilters
): Promise<SurveyTemplate[]> => {
  const params = new URLSearchParams();
  
  if (filters?.surveyType) {
    params.append("surveyType", filters.surveyType);
  }
  if (filters?.isDraft !== undefined) {
    params.append("isDraft", filters.isDraft.toString());
  }
  if (filters?.searchTerm) {
    params.append("searchTerm", filters.searchTerm);
  }

  const queryString = params.toString();
  const url = queryString ? `${SURVEY_TEMPLATES_API_URL}?${queryString}` : SURVEY_TEMPLATES_API_URL;
  
  const { data } = await api.get<SurveyTemplate[]>(url);
  return data;
};

export const getSurveyTemplateById = async (
  id: string
): Promise<SurveyTemplate> => {
  const { data } = await api.get<SurveyTemplate>(`${SURVEY_TEMPLATES_API_URL}/${id}`);
  return data;
};

export const createSurveyTemplate = async (
  template: CreateSurveyTemplateRequest
): Promise<string> => {
  const { data } = await api.post<string>(SURVEY_TEMPLATES_API_URL, template);
  return data;
};

export const updateSurveyTemplate = async (
  id: string,
  template: UpdateSurveyTemplateRequest
): Promise<void> => {
  await api.put(`${SURVEY_TEMPLATES_API_URL}/${id}`, template);
};

export const deleteSurveyTemplate = async (id: string): Promise<void> => {
  await api.delete(`${SURVEY_TEMPLATES_API_URL}/${id}`);
};
