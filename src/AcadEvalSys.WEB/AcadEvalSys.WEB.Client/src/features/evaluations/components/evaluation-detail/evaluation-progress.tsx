import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { CheckCircle, Clock, Users } from "lucide-react";
import { Evaluation } from "../../models";

interface EvaluationProgressProps {
  evaluation: Evaluation;
}

export const EvaluationProgress = memo(function EvaluationProgress({
  evaluation,
}: EvaluationProgressProps) {
  // Memoizar cálculos de progreso
  const { completed, total, pending, pct } = useMemo(
    () => ({
      completed: evaluation.completedProfessorAssignmentsCount,
      total: evaluation.totalProfessorAssignmentsCount,
      pending: Math.max(
        evaluation.totalProfessorAssignmentsCount -
          evaluation.completedProfessorAssignmentsCount,
        0
      ),
      pct: Math.round(evaluation.overallProgressPercentage || 0),
    }),
    [
      evaluation.completedProfessorAssignmentsCount,
      evaluation.totalProfessorAssignmentsCount,
      evaluation.overallProgressPercentage,
    ]
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Progreso General</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Progress value={pct} className="flex-1" />
            <span className="font-semibold text-lg tabular-nums">{pct}%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">Completadas:</span>
              <span className="font-medium tabular-nums">{completed}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-muted-foreground">Pendientes:</span>
              <span className="font-medium tabular-nums">{pending}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium tabular-nums">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
