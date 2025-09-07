import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Users, CheckCircle } from "lucide-react";
import { ProfessorEvaluationAssignment } from "@/features/professor-evaluations/models/professor-evaluation";

interface ProgressCardProps {
  assignment: ProfessorEvaluationAssignment;
  evaluatedCount: number;
  pendingCount: number;
}

export function ProgressCard({
  evaluatedCount,
  pendingCount,
}: ProgressCardProps) {
  // Calcular el total correctamente: evaluados + pendientes
  const totalStudents = evaluatedCount + pendingCount;
  const progressPercentage =
    totalStudents > 0
      ? Math.round((evaluatedCount / totalStudents) * 100 * 10) / 10 // Redondear a 1 decimal
      : 0;

  // Determinar si está completada
  const isCompleted = pendingCount === 0 && totalStudents > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Progreso de Evaluación
          </div>
          {isCompleted && (
            <Badge
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Completada
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800">
              {totalStudents}
            </div>
            <div className="text-sm text-muted-foreground">
              Total de Estudiantes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">
              {evaluatedCount}
            </div>
            <div className="text-sm text-muted-foreground">Evaluados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">
              {pendingCount}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progreso general</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
