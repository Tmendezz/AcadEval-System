import { useParams, Link } from "wouter";
import { useState } from "react";
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
import {
  ArrowLeft,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { StudentEvaluationModal } from "../components/student-evaluation-modal";
import { StudentForEvaluation } from "../types/professor-evaluation";
import { useGetStudentsForAssignment } from "../hooks/professor-evaluations";

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [selectedStudent, setSelectedStudent] = useState<StudentForEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: students, isLoading } = useGetStudentsForAssignment(
    assignmentId || ""
  );

  const evaluatedStudents =
    students?.filter((student) => student.status === "Evaluated") || [];

  const pendingStudents =
    students?.filter((student) => student.status === "Pending") || [];

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
    if (status === "Completed") {
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

  if (isLoading) {
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

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header con navegación */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/evaluaciones/mis-evaluaciones">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Mis Evaluaciones
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              Detalle de Asignación
            </h1>
            <p className="text-muted-foreground">
              Revisa el progreso de los estudiantes en esta competencia
            </p>
          </div>

          {/* Resumen de la asignación */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Resumen de la Asignación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {students?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Estudiantes
                  </div>
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

          {/* Lista de estudiantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Estudiantes ({students?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!students || students.length === 0 ? (
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
                          {student.competencyLevel
                            ? getCompetencyLevelBadge(student.competencyLevel)
                            : (
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
