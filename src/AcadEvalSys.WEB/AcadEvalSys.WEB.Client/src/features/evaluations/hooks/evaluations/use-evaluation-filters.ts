import { useAdvancedFiltering } from "@/shared/hooks/use-filtering";
import { Evaluation } from "../../types/types";

export const useEvaluationFilters = (evaluations: Evaluation[]) => {
  const filterConfig = {
    searchFields: ["title", "description"] as (keyof Evaluation)[],
    filterFields: {
      status: (evaluation: Evaluation, value: string) => {
        if (value === "all") return true;

        const now = new Date();
        const from = new Date(evaluation.periodFrom);
        const to = new Date(evaluation.periodTo);

        switch (value) {
          case "active":
            return now >= from && now <= to;
          case "completed":
            return now > to;
          case "upcoming":
            return now < from;
          default:
            return true;
        }
      },
      career: (evaluation: Evaluation, value: string) => {
        if (value === "all") return true;
        // TODO: Implementar filtro por carrera cuando se tenga la relación
        return true;
      },
    },
    sortFields: {
      title: (a: Evaluation, b: Evaluation) => a.title.localeCompare(b.title),
      periodFrom: (a: Evaluation, b: Evaluation) =>
        new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime(),
      periodTo: (a: Evaluation, b: Evaluation) =>
        new Date(a.periodTo).getTime() - new Date(b.periodTo).getTime(),
    },
  };

  return useAdvancedFiltering(evaluations, filterConfig);
};
