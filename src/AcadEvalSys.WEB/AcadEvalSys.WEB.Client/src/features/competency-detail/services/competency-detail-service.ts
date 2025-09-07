import { api } from "@infrastructure/query/axios";

const COMPETENCIES_API_URL = "/competencies";

export const getCompetencyLevels = async (competencyId: string) => {
  const { data } = await api.get(
    `${COMPETENCIES_API_URL}/${competencyId}/levels`
  );
  return data;
};

export const updateCompetencyLevels = async (
  competencyId: string,
  levels: { level: string; description: string }[]
) => {
  const { data } = await api.put(
    `${COMPETENCIES_API_URL}/${competencyId}/levels`,
    {
      levels,
    }
  );
  return data;
};

export const getCompetencyEvaluations = async (competencyId: string) => {
  const { data } = await api.get(
    `${COMPETENCIES_API_URL}/${competencyId}/evaluations`
  );
  return data;
};

export const getCompetencyStats = async (competencyId: string) => {
  const { data } = await api.get(
    `${COMPETENCIES_API_URL}/${competencyId}/stats`
  );
  return data;
};
