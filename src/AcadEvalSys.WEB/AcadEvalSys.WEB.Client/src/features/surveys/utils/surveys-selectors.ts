import { Survey } from "../types/surveys";

export function filterSurveys(
  surveys: Survey[],
  searchTerm: string,
  statusFilter: Survey["status"] | "all",
  typeFilter: Survey["type"] | "all"
): Survey[] {
  return surveys.filter((survey) => {
    const matchesSearch =
      searchTerm === "" ||
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || survey.status === statusFilter;
    const matchesType = typeFilter === "all" || survey.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });
}



