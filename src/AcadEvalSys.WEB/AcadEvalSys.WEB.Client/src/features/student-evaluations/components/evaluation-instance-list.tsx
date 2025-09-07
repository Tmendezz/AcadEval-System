import { Calendar, FileText } from "lucide-react";
import { StudentEvaluationInstance } from "../models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";

interface EvaluationInstancesListProps {
  instances: StudentEvaluationInstance[];
  selectedInstance: StudentEvaluationInstance | null;
  onInstanceSelect: (instance: StudentEvaluationInstance) => void;
}

export function EvaluationInstancesList({
  instances,
  selectedInstance,
  onInstanceSelect,
}: EvaluationInstancesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Instancias de Evaluación
        </CardTitle>
        <CardDescription>
          Selecciona una instancia para ver tus evaluaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {instances.map((instance) => (
          <div
            key={instance.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedInstance?.id === instance.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onInstanceSelect(instance)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{instance.title}</h4>
              <Badge variant="outline" className="text-xs">
                {instance.semester}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progreso</span>
                <span>{instance.progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={instance.progressPercentage} className="h-2" />

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {instance.completedCompetencies}/{instance.totalCompetencies}{" "}
                  competencias
                </span>
                {instance.hasReport && (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Reporte disponible
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
