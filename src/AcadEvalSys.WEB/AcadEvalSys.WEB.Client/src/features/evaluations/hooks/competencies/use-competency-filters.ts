import { useAdvancedFiltering } from "@/shared/hooks/use-filtering";
import { Competency } from "@/shared/types";

export const useCompetencyFilters = (competencies: Competency[]) => {
  const filterConfig = {
    searchFields: ["name", "description"] as (keyof Competency)[],
    filterFields: {
      type: (competency: Competency, value: string) => {
        if (value === "all") return true;
        return competency.type.toLowerCase() === value.toLowerCase();
      },
    },
    sortFields: {
      name: (a: Competency, b: Competency) => a.name.localeCompare(b.name),
      type: (a: Competency, b: Competency) => a.type.localeCompare(b.type),
    },
  };

  return useAdvancedFiltering(competencies, filterConfig);
};
