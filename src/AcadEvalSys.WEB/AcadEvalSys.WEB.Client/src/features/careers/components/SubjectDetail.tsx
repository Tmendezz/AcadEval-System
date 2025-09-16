import { useParams } from "wouter";
import { useRef, useState, useCallback } from "react";
import { navigate } from "wouter/use-browser-location";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ArrowLeft, GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
import { useSubject, useDeleteSubject } from "../hooks";
import { EnrolledStudentsManagement } from "../components";
import { EnrolledStudent } from "@infrastructure/api/types/subject";
import { Student } from "@infrastructure/api/types/student";
import { CareerYear } from "@infrastructure/api/types/enums";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import type { EnrolledStudentsManagementHandle } from "../components/enrolled-students-management";
import { StudentSelectionDialog } from "../components/student-selection-dialog";

export function SubjectDetail() {
  const { careerId, subjectId } = useParams();

  const { subject, isLoadingSubject } = useSubject(subjectId!, careerId!);
  const deleteSubjectMutation = useDeleteSubject();

  const listRef = useRef<EnrolledStudentsManagementHandle | null>(null);
  const handleSelectionChange = useCallback(() => {
    // Selection change handled by component
  }, []);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const convertEnrolledStudentsToStudents = (
    enrolledStudents: EnrolledStudent[]
  ): Student[] => {
    return enrolledStudents.map((enrolled) => ({
      id: enrolled.studentId,
      name: enrolled.studentName,
      email: enrolled.studentEmail,
      currentYear:
        enrolled.currentYear === "First"
          ? CareerYear.First
          : enrolled.currentYear === "Second"
          ? CareerYear.Second
          : CareerYear.Third,
      technicalCareerName: enrolled.technicalCareerName,
    }));
  };

  const handleDeleteSubject = async () => {
    if (!careerId || !subjectId) return;

    await deleteSubjectMutation.mutateAsync({
      careerId,
      subjectId,
    });

    // Navegar de vuelta a la página de la carrera
    navigate(`/carreras/${careerId}`);
  };

  if (isLoadingSubject) {
    return (
      <PageLayout>
        <LoadingState message="Cargando detalles de la asignatura..." />
      </PageLayout>
    );
  }

  if (!subject) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-2">
            Asignatura no encontrada
          </h2>
          <p className="text-muted-foreground mb-4">
            La asignatura que buscas no existe o no tienes permisos para verla.
          </p>
          <Button
            onClick={() => navigate(`/admin`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Carreras
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={subject.name}
        description={`Detalles de la asignatura ${subject.name} - ${subject.year}`}
      >
        <div className="flex gap-2">
          <Button onClick={() => setIsEnrollDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Inscribir alumnos
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Profesor Asignado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subject.professorName ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{subject.professorName}</p>
                  </div>
                  {subject.professorId ? (
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4 mr-2" />
                      Cambiar Profesor
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Asignar Profesor
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground text-center">
                    No hay profesor asignado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </PageSection>

        {/* Gestión de Estudiantes */}
        <EnrolledStudentsManagement
          ref={listRef}
          enrolledStudents={convertEnrolledStudentsToStudents(
            subject.enrolledStudents || []
          )}
          subjectId={subjectId!}
          subjectName={subject.name}
          careerId={careerId!}
          isLoading={isLoadingSubject}
          onSelectionChange={handleSelectionChange}
        />
        <StudentSelectionDialog
          open={isEnrollDialogOpen}
          onOpenChange={setIsEnrollDialogOpen}
          careerId={careerId!}
          subjectId={subjectId!}
          subjectName={subject.name}
        />

        <ConfirmDialog
          title="Eliminar asignatura"
          description={`¿Estás seguro de que quieres eliminar la asignatura "${subject.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteSubject}
          trigger={
            <Button
              variant="destructive"
              disabled={deleteSubjectMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar asignatura
            </Button>
          }
        />
      </PageContent>
    </PageLayout>
  );
}
