import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Calendar, Target } from "lucide-react";
import { ProfessorAssignmentFromApi } from "../../types/professor-evaluation";

interface CompetencyInfoCardProps {
  assignment: ProfessorAssignmentFromApi;
}

export function CompetencyInfoCard({ assignment }: CompetencyInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Información de la Competencia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <span className="font-medium">Competencia:</span>
          <span className="text-muted-foreground ml-2">
            {assignment.competencyName}
          </span>
        </div>
        <div>
          <span className="font-medium">Descripción:</span>
          <span className="text-muted-foreground ml-2">
            {assignment.competencyDescription}
          </span>
        </div>
        {assignment.periodFrom && assignment.periodTo && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Período:</span>
            <span className="text-muted-foreground">
              {new Date(assignment.periodFrom).toLocaleDateString()} -{" "}
              {new Date(assignment.periodTo).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
