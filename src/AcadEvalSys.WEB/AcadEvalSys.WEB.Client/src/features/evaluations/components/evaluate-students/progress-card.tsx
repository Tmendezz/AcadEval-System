import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Users } from "lucide-react";
import { ProfessorAssignmentFromApi } from "../../types/professor-evaluation";

interface ProgressCardProps {
  assignment: ProfessorAssignmentFromApi;
  evaluatedCount: number;
  pendingCount: number;
}

export function ProgressCard({
  assignment,
  evaluatedCount,
  pendingCount,
}: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Progreso de Evaluación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {assignment.totalStudentsCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Total de Estudiantes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {evaluatedCount}
            </div>
            <div className="text-sm text-muted-foreground">Evaluados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progreso general</span>
            <span>{assignment.progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${assignment.progressPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
