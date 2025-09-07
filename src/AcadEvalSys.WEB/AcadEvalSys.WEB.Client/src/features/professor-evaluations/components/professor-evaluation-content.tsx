import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Users, CheckCircle, Clock } from "lucide-react";
import { ProfessorAssignment, StudentForEvaluation } from "../models";

interface ProfessorEvaluationContentProps {
  assignment: ProfessorAssignment;
  students: StudentForEvaluation[];
  evaluatedStudents: StudentForEvaluation[];
  pendingStudents: StudentForEvaluation[];
  onEvaluateStudent: (student: StudentForEvaluation) => void;
}

export function ProfessorEvaluationContent({
  assignment,
  students,
  evaluatedStudents,
  pendingStudents,
  onEvaluateStudent,
}: ProfessorEvaluationContentProps) {
  const progressPercentage =
    students.length > 0
      ? (evaluatedStudents.length / students.length) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Información de la Asignación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {assignment.careerName}
              </div>
              <div className="text-sm text-muted-foreground">Carrera</div>
            </div>
            <div className="text-center p-4 bg-blue-100/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {assignment.careerYear}° Año
              </div>
              <div className="text-sm text-blue-600">Año</div>
            </div>
            <div className="text-center p-4 bg-green-100/50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {evaluatedStudents.length}
              </div>
              <div className="text-sm text-green-600">Evaluados</div>
            </div>
            <div className="text-center p-4 bg-orange-100/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">
                {pendingStudents.length}
              </div>
              <div className="text-sm text-orange-600">Pendientes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progreso</span>
              <span className="font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {evaluatedStudents.length} de {students.length} estudiantes
              evaluados
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Estudiantes ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p>No hay estudiantes asignados a esta competencia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {student.studentName}
                      </h3>
                      <Badge
                        variant={
                          student.status === "Evaluated"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          student.status === "Evaluated"
                            ? "bg-green-100 text-green-800"
                            : "text-orange-600 border-orange-200"
                        }
                      >
                        {student.status === "Evaluated" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {student.status === "Evaluated"
                          ? "Evaluado"
                          : "Pendiente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {student.studentEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEvaluateStudent(student)}
                    >
                      {student.status === "Evaluated"
                        ? "Ver Evaluación"
                        : "Evaluar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
