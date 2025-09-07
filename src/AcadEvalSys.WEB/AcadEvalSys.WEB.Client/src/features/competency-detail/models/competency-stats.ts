export interface CompetencyStats {
  totalEvaluations: number;
  averageScore: number;
  completionRate: number;
  levelDistribution: {
    level: number;
    count: number;
    percentage: number;
  }[];
  recentEvaluations: {
    id: string;
    studentName: string;
    score: number;
    level: number;
    evaluatedAt: string;
  }[];
}
