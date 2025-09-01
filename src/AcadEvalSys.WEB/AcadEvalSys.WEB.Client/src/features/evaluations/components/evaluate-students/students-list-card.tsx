import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Users, User, Mail, Star, CheckCircle, Clock } from "lucide-react";
import { StudentForEvaluation } from "../../types/professor-evaluation";

interface StudentsListCardProps {
  students: StudentForEvaluation[];
  onEvaluateStudent: (student: StudentForEvaluation) => void;
}

export function StudentsListCard({
  students,
  onEvaluateStudent,
}: StudentsListCardProps) {
  const getCompetencyLevelBadge = (level: string) => {
    const colors = {
      Inicial: "bg-blue-100 text-blue-800 border-blue-200",
      Intermedio: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Avanzado: "bg-orange-100 text-orange-800 border-orange-200",
      Excelente: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <Badge
        variant="outline"
        className={colors[level as keyof typeof colors] || colors.Inicial}
      >
        <Star className="w-3 h-3 mr-1" />
        {level}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "Evaluated") {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Evaluado
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Pendiente
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Lista de Estudiantes
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {students.length} estudiantes asignados a esta competencia
        </div>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {student.studentEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {student.status === "Evaluated" &&
                    student.competencyLevel && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Nivel:
                        </span>
                        {getCompetencyLevelBadge(student.competencyLevel)}
                      </div>
                    )}

                  {getStatusBadge(student.status)}

                  <Button
                    variant={
                      student.status === "Evaluated" ? "outline" : "default"
                    }
                    size="sm"
                    onClick={() => onEvaluateStudent(student)}
                  >
                    {student.status === "Evaluated" ? "Re-evaluar" : "Evaluar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay estudiantes asignados
            </h3>
            <p className="text-muted-foreground">
              No se han asignado estudiantes a esta competencia aún.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
