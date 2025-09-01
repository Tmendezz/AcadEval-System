import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Target } from "lucide-react";
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
          <p className="text-muted-foreground">{assignment.competencyName}</p>
        </div>
        <div>
          <span className="font-medium">Descripción:</span>
          <p className="text-muted-foreground">
            {assignment.competencyDescription}
          </p>
        </div>
        <div>
          <span className="font-medium">Asignatura:</span>
          <p className="text-muted-foreground">{assignment.subjectName}</p>
        </div>
      </CardContent>
    </Card>
  );
}
