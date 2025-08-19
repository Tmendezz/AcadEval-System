import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Evaluation } from "@/shared/types/evaluation";

interface EvaluationBasicInfoProps {
  evaluation: Evaluation;
}

export function EvaluationBasicInfo({ evaluation }: EvaluationBasicInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Información de la Evaluación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">
              Semestre
            </h4>
            <Badge variant="outline" className="mt-1">
              {evaluation.semester === "First"
                ? "Primer Semestre"
                : "Segundo Semestre"}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">
              Período
            </h4>
            <p className="text-sm mt-1">
              {new Date(evaluation.periodFrom).toLocaleDateString()} - {new Date(evaluation.periodTo).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">
              Estado
            </h4>
            <Badge 
              variant={evaluation.status === "Completed" ? "default" : "secondary"}
              className={`mt-1 ${
                evaluation.status === "Completed" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {evaluation.status === "Completed" ? "Completada" : "Pendiente"}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">
              Creada
            </h4>
            <p className="text-sm mt-1">
              {new Date(evaluation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 