import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Evaluation } from "../../models";

interface EvaluationBasicInfoProps {
  evaluation: Evaluation;
}

export const EvaluationBasicInfo = memo(function EvaluationBasicInfo({
  evaluation,
}: EvaluationBasicInfoProps) {
  // Memoizar formateo de fechas
  const formattedDates = useMemo(
    () => ({
      period: `${new Date(evaluation.periodFrom).toLocaleDateString()} - ${new Date(evaluation.periodTo).toLocaleDateString()}`,
      createdAt: new Date(evaluation.createdAt).toLocaleDateString(),
    }),
    [evaluation.periodFrom, evaluation.periodTo, evaluation.createdAt]
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Información de la Evaluación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Semestre
            </h4>
            <Badge variant="outline" className="mt-2">
              {evaluation.semester === "First" ? "Primer Semestre" : "Segundo Semestre"}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Período
            </h4>
            <p className="text-sm mt-2">{formattedDates.period}</p>
          </div>
          <div>
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Estado
            </h4>
            <Badge
              variant={evaluation.status === "Completed" ? "default" : "secondary"}
              className="mt-2"
            >
              {evaluation.status === "Completed" ? "Completada" : "Pendiente"}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Creada
            </h4>
            <p className="text-sm mt-2">{formattedDates.createdAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
