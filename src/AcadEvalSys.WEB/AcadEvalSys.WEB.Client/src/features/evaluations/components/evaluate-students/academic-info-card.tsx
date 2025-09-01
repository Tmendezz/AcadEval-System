import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { GraduationCap, Calendar } from "lucide-react";
import { ProfessorAssignmentFromApi } from "../../types/professor-evaluation";

interface AcademicInfoCardProps {
  assignment: ProfessorAssignmentFromApi;
}

export function AcademicInfoCard({ assignment }: AcademicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-green-600" />
          Información Académica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <span className="font-medium">Tecnicatura:</span>
          <span className="text-muted-foreground ml-2">
            {assignment.careerName}
          </span>
        </div>
        <div>
          <span className="font-medium">Año:</span>
          <Badge variant="outline" className="ml-2">
            {assignment.careerYear}° Año
          </Badge>
        </div>
        <div>
          <span className="font-medium">Asignatura:</span>
          <span className="text-muted-foreground ml-2">
            {assignment.subjectName}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
