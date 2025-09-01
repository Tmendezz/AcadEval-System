import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import {
  getProfessorAssignmentById,
  getStudentsForAssignment,
} from "../services/professor-evaluation-service";
import { StudentEvaluationModal } from "../components/student-evaluation-modal";
import { useState } from "react";
import { StudentForEvaluation } from "../types/professor-evaluation";

export default function EvaluationToCompleteDetailPage() {
  const { assignmentId } = useParams<{
    assignmentId: string;
  }>();

  const [selectedStudent, setSelectedStudent] =
    useState<StudentForEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: assignment, isLoading: isLoadingAssignment } = useQuery({
    queryKey: ["professor-assignment", assignmentId],
    queryFn: () => getProfessorAssignmentById(assignmentId || ""),
    enabled: !!assignmentId,
  });

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["assignment-students", assignmentId],
    queryFn: () => getStudentsForAssignment(assignmentId || ""),
    enabled: !!assignmentId,
  });

  const evaluatedStudents =
    students?.filter((s) => s.status === "Evaluated") || [];
  const pendingStudents = students?.filter((s) => s.status === "Pending") || [];
  const progressPercentage = students
    ? (evaluatedStudents.length / students.length) * 100
    : 0;

  const getCompetencyLevelBadge = (level: string) => {
    const colors = {
      Ninguno: "bg-gray-100 text-gray-800 border-gray-200",
      Inicial: "bg-blue-100 text-blue-800 border-blue-200",
      Intermedio: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Avanzado: "bg-orange-100 text-orange-800 border-orange-200",
      Excelente: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <Badge
        variant="outline"
        className={colors[level as keyof typeof colors] || colors.Ninguno}
      >
        <Star className="w-3 h-3 mr-1" />
        {level}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "Evaluated") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Evaluado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-200">
        <Clock className="w-3 h-3 mr-1" />
        Pendiente
      </Badge>
    );
  };

  const handleEvaluateStudent = (student: StudentForEvaluation) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  if (isLoadingAssignment || isLoadingStudents) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="mb-6">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  if (!assignment || !students) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-destructive">
                Asignación no encontrada
              </h3>
              <p className="text-sm text-muted-foreground">
                La asignación solicitada no existe o no tienes acceso.
              </p>
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header con navegación */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/evaluaciones/docentes/mis-evaluaciones">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Mis Evaluaciones
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              Evaluación de Competencia
            </h1>
            <p className="text-muted-foreground">
              {assignment.competencyName} - {assignment.subjectName}
            </p>
          </div>

          {/* Información de la asignación */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Detalles de la Asignación
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

          {/* Progreso general */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Progreso General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progreso de evaluación</span>
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

          {/* Lista de estudiantes */}
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
                          {getStatusBadge(student.status)}
                          {student.competencyLevel ? (
                            getCompetencyLevelBadge(student.competencyLevel)
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-800 border-gray-200"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Sin calificar
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {student.studentEmail}
                        </p>
                        {student.assessmentDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Evaluado el:{" "}
                            {new Date(
                              student.assessmentDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEvaluateStudent(student)}
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

          {/* Modal de evaluación de estudiante */}
          {selectedStudent && (
            <StudentEvaluationModal
              student={selectedStudent}
              assignmentId={assignmentId || ""}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          )}
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
