import { StatCard } from "@/shared/components/ui/stat-card";
import { FileBarChart, PlayCircle, CheckCircle, Clock } from "lucide-react";

interface EvaluationStatisticsProps {
  totalEvaluations: number;
  activeEvaluations: number;
  completedEvaluations: number;
  upcomingEvaluations: number;
  className?: string;
}

export const EvaluationStatistics = ({
  totalEvaluations,
  activeEvaluations,
  completedEvaluations,
  upcomingEvaluations,
  className,
}: EvaluationStatisticsProps) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      <StatCard
        title="Total Evaluaciones"
        value={totalEvaluations}
        description="Evaluaciones creadas"
        icon={<FileBarChart className="h-4 w-4" />}
      />
      <StatCard
        title="En Progreso"
        value={activeEvaluations}
        description="Evaluaciones activas"
        icon={<PlayCircle className="h-4 w-4" />}
      />
      <StatCard
        title="Completadas"
        value={completedEvaluations}
        description="Evaluaciones finalizadas"
        icon={<CheckCircle className="h-4 w-4" />}
      />
      <StatCard
        title="Próximas"
        value={upcomingEvaluations}
        description="Evaluaciones programadas"
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  );
};
