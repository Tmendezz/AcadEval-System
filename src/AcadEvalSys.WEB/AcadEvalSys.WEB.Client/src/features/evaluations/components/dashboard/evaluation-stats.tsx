import { StatCard } from "@/shared/components/ui/stat-card";
import { FileBarChart, PlayCircle, Target, Brain, Code } from "lucide-react";

interface EvaluationStatsProps {
  evaluationStats: Array<{
    key: string;
    label: string;
    value: number;
    icon?: string;
  }>;
  competencyStats: Array<{
    key: string;
    label: string;
    value: number;
    icon?: string;
  }>;
}

const iconMap = {
  FileBarChart: FileBarChart,
  PlayCircle: PlayCircle,
  Target: Target,
  Brain: Brain,
  Code: Code,
};

export function EvaluationStats({
  evaluationStats,
  competencyStats,
}: EvaluationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Estadísticas de Evaluaciones */}
      {evaluationStats.map((stat) => {
        const IconComponent = stat.icon
          ? iconMap[stat.icon as keyof typeof iconMap]
          : FileBarChart;
        return (
          <StatCard
            key={stat.key}
            title={stat.label}
            value={stat.value}
            icon={<IconComponent className="h-4 w-4" />}
            description={`Total de ${stat.label.toLowerCase()}`}
          />
        );
      })}

      {/* Estadísticas de Competencias */}
      {competencyStats.map((stat) => {
        const IconComponent = stat.icon
          ? iconMap[stat.icon as keyof typeof iconMap]
          : Target;
        return (
          <StatCard
            key={stat.key}
            title={stat.label}
            value={stat.value}
            icon={<IconComponent className="h-4 w-4" />}
            description={`Total de ${stat.label.toLowerCase()}`}
          />
        );
      })}
    </div>
  );
}
