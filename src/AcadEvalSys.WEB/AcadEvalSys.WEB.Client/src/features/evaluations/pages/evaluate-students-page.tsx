import { useParams, Link } from "wouter";
import { useState } from "react";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { StudentEvaluationModal } from "../components/student-evaluation-modal";
import { StudentForEvaluation } from "../types/professor-evaluation";
import { useGetStudentsForAssignment } from "../hooks/professor-evaluations";
import { useGetProfessorAssignmentById } from "../hooks/professor-evaluations/use-professor-assignment-by-id";
import { CompetencyInfoCard } from "../components/evaluate-students/competency-info-card";
import { AcademicInfoCard } from "../components/evaluate-students/academic-info-card";
import { ProgressCard } from "../components/evaluate-students/progress-card";
import { StudentsListCard } from "../components/evaluate-students/students-list-card";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function EvaluateStudentsPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [selectedStudent, setSelectedStudent] =
    useState<StudentForEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Limpiar el assignmentId si tiene sufijos extraños
  const cleanAssignmentId = assignmentId?.split("@")[0] || "";

  const {
    data: assignment,
    isLoading: isLoadingAssignment,
    error: assignmentError,
    refetch: refetchAssignment,
  } = useGetProfessorAssignmentById(cleanAssignmentId);

  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
    refetch: refetchStudents,
  } = useGetStudentsForAssignment(cleanAssignmentId);

  // Asegurar que students sea un array
  const studentsArray = Array.isArray(students) ? students : [];

  const evaluatedStudents =
    studentsArray.filter((student) => student.status === "Evaluated") || [];

  const pendingStudents =
    studentsArray.filter((student) => student.status === "Pending") || [];

  const handleEvaluateStudent = (student: StudentForEvaluation) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEvaluationComplete = async () => {
    try {
      // Invalidar y refetch las queries relevantes
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["students-for-assignment", "assignment", assignmentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["professor-assignment-by-id", "assignment", assignmentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["all-professor-assignments"],
        }),
      ]);

      toast.success("Evaluación completada. Datos actualizados.");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      toast.error("Error al actualizar los datos. Intente recargar la página.");
    }
  };

  const handleRetry = () => {
    refetchAssignment();
    refetchStudents();
  };

  // Manejo de errores
  if (assignmentError || studentsError) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Error al cargar los datos
              </h3>
              <p className="text-muted-foreground mb-4">
                {assignmentError?.message ||
                  studentsError?.message ||
                  "No se pudieron cargar los datos de la asignación."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleRetry} variant="outline">
                  Reintentar
                </Button>
                <Button asChild>
                  <Link href="/evaluaciones/mis-evaluaciones">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a mis evaluaciones
                  </Link>
                </Button>
              </div>
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  if (isLoadingAssignment || isLoadingStudents) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  if (!assignment) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Asignación no encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                La asignación que buscas no existe o no tienes permisos para
                acceder.
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
          {/* Header con botón de regreso */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/evaluaciones/mis-evaluaciones">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a mis evaluaciones
              </Link>
            </Button>

            <h1 className="text-3xl font-bold tracking-tight">
              Evaluar Competencia
            </h1>
            <p className="text-muted-foreground">
              Evalúa a los estudiantes en la competencia asignada
            </p>
          </div>

          {/* Información de la asignación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CompetencyInfoCard assignment={assignment} />
            <AcademicInfoCard assignment={assignment} />
          </div>

          {/* Estadísticas de progreso */}
          <div className="mb-8">
            <ProgressCard
              assignment={assignment}
              evaluatedCount={evaluatedStudents.length}
              pendingCount={pendingStudents.length}
            />
          </div>

          {/* Lista de estudiantes */}
          <StudentsListCard
            students={studentsArray}
            onEvaluateStudent={handleEvaluateStudent}
          />
        </PageSection>
      </PageContent>

      {/* Modal de evaluación */}
      {selectedStudent && (
        <StudentEvaluationModal
          student={selectedStudent}
          assignmentId={assignmentId || ""}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEvaluationComplete={handleEvaluationComplete}
        />
      )}
    </PageLayout>
  );
}
