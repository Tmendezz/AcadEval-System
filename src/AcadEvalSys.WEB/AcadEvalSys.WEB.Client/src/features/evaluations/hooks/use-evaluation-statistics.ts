import { useStatistics } from "@/shared/hooks/use-statistics";
import { Evaluation } from "../types/types";
import { Competency } from "@/shared/types";

export const useEvaluationStatistics = (
  evaluations: Evaluation[],
  competencies: Competency[]
) => {
  const evaluationStatsConfig = {
    items: [
      {
        key: "totalEvaluations",
        label: "Total Evaluaciones",
        calculate: (data: Evaluation[]) => data.length,
        icon: "FileBarChart",
      },
      {
        key: "evaluationsThisPeriod",
        label: "Evaluaciones en Período",
        calculate: (data: Evaluation[]) => {
          const now = new Date();
          return data.filter((e) => {
            const from = new Date(e.periodFrom);
            const to = new Date(e.periodTo);
            return now >= from && now <= to;
          }).length;
        },
        icon: "PlayCircle",
      },
    ],
  };

  const competencyStatsConfig = {
    items: [
      {
        key: "totalCompetencies",
        label: "Total Competencias",
        calculate: (data: Competency[]) => data.length,
        icon: "Target",
      },
      {
        key: "softCompetencies",
        label: "Competencias Blandas",
        calculate: (data: Competency[]) =>
          data.filter((c) => c.type === "Soft").length,
        icon: "Brain",
      },
      {
        key: "technicalCompetencies",
        label: "Competencias Técnicas",
        calculate: (data: Competency[]) =>
          data.filter((c) => c.type === "Technical").length,
        icon: "Code",
      },
    ],
  };

  const evaluationStats = useStatistics(evaluations, evaluationStatsConfig);
  const competencyStats = useStatistics(competencies, competencyStatsConfig);

  return {
    evaluationStats: evaluationStats.stats,
    competencyStats: competencyStats.stats,
  };
};
