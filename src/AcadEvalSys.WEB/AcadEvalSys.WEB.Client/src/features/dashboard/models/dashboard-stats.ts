export interface DashboardStats {
  studentsCount: number;
  professorsCount: number;
  careersCount: number;
  evaluationsInProgressCount: number;
  totalEvaluations: number;
  completedEvaluations: number;
  surveysInProgressCount: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type:
    | "evaluation_created"
    | "evaluation_completed"
    | "student_enrolled"
    | "professor_assigned";
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}
