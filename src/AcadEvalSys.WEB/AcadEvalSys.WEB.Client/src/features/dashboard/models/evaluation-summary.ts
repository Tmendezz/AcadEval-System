export interface EvaluationSummary {
  id: string;
  name: string;
  status: "draft" | "active" | "completed" | "cancelled";
  progress: number;
  startDate: string;
  endDate: string;
  assignmentsCount: number;
  completedAssignments: number;
}
