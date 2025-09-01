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
          <p className="text-muted-foreground">{assignment.careerName}</p>
        </div>
        <div>
          <span className="font-medium">Año:</span>
          <Badge variant="outline">{assignment.careerYear}° Año</Badge>
        </div>
        {assignment.periodFrom && assignment.periodTo && (
          <div>
            <span className="font-medium">Período:</span>
            <div className="text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(assignment.periodFrom).toLocaleDateString()} -{" "}
                  {new Date(assignment.periodTo).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
