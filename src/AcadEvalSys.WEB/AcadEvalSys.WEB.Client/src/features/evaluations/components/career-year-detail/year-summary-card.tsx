import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Users, CheckCircle, Clock } from "lucide-react";

interface YearSummaryCardProps {
  careerName: string;
  year: string;
  metrics: {
    completed: number;
    pending: number;
    total: number;
  };
}

export function YearSummaryCard({
  careerName,
  year,
  metrics,
}: YearSummaryCardProps) {
  const progressPercentage =
    metrics.total > 0
      ? Math.round((metrics.completed / metrics.total) * 100)
      : 0;

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {careerName} - Año {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">
                {metrics.completed} completadas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">
                {metrics.pending} pendientes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{metrics.total} total</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {progressPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">Progreso</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
