import { StatCard } from "@/shared/components/ui/stat-card";
import { AdminStatistics } from "@/shared/types/statistics";
import { BookOpen, Users, GraduationCap, Building } from "lucide-react";

interface StatisticsCardsProps {
  stats: AdminStatistics;
  totalSubjects?: number;
  className?: string;
}

export const StatisticsCards = ({
  stats,
  totalSubjects,
  className = "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
}: StatisticsCardsProps) => {
  return (
    <div className={className}>
      <StatCard
        title="Total Asignaturas"
        value={totalSubjects || 0}
        icon={<BookOpen className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Total Estudiantes"
        value={stats.totalStudents}
        icon={<Users className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Total Profesores"
        value={stats.totalProfessors}
        icon={<GraduationCap className="h-4 w-4" />}
        trend={{ value: 0, isPositive: true }}
      />
      <StatCard
        title="Carreras Activas"
        value={stats.totalCareers}
        icon={<Building className="h-4 w-4" />}
        trend={{ value: 3, isPositive: true }}
      />
    </div>
  );
};
