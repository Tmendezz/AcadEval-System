import { useParams, Link } from "wouter";
import {
  PageLayout,
  PageContent,
  PageSection,
  PageHeader,
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
import { ArrowLeft, Users, BookOpen, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/infrastructure/query/queryClient";
import { completeStudentAssessment } from "@/features/professor-evaluations/services/professor-evaluations-service";
import { useProfessorAssignment } from "@/features/professor-evaluations/hooks/use-professor-assignment";
import { useAssignmentStudents } from "@/features/professor-evaluations/hooks/use-assignment-students";
import { useMemo } from "react";
import { StudentCompetencyEvaluation } from "@/features/professor-evaluations/models/professor-evaluation";
import { useProfessorEvaluationsStore } from "@/features/professor-evaluations/store/use-professor-evaluations-store";
import type { ProfessorEvaluationsState } from "@/features/professor-evaluations/store/use-professor-evaluations-store";
import { getNivelBadgeVariant, getNivelColor } from "@/features/professor-evaluations/utils/levels";

export function ProfessorEvaluationPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const pendingSaves = useProfessorEvaluationsStore(
    (s: ProfessorEvaluationsState) => s.pendingSaves
  );
  const setPendingSave = useProfessorEvaluationsStore(
    (s: ProfessorEvaluationsState) => s.setPendingSave
  );
  const clearPendingSaves = useProfessorEvaluationsStore(
    (s: ProfessorEvaluationsState) => s.clearPendingSaves
  );
  const lastSavedAt = useProfessorEvaluationsStore(
    (s: ProfessorEvaluationsState) => s.lastSavedAt
  );
  const setLastSavedAt = useProfessorEvaluationsStore(
    (s: ProfessorEvaluationsState) => s.setLastSavedAt
  );

  const { data: assignment, isLoading: isLoadingAssignment } = useProfessorAssignment(
    assignmentId || ""
  );

  const { data: studentsData, isLoading: isLoadingStudents } = useAssignmentStudents(
    assignmentId || ""
  );

  const students: StudentCompetencyEvaluation[] =
    studentsData?.studentEvaluations || [];

  const progress = useMemo(() => {
    if (!studentsData) return 0;
    const value =
      (studentsData.evaluatedStudentsCount / studentsData.totalStudentsCount) *
      100;
    return Number.isFinite(value) ? value : 0;
  }, [studentsData]);

  

  const mutation = useMutation({
    mutationFn: async () => {
      const entries = Object.entries(pendingSaves);
      await Promise.all(
        entries.map(([studentId, competencyLevel]) =>
          completeStudentAssessment(assignmentId || "", studentId, {
            competencyLevel: competencyLevel as any,
            observations: undefined,
          })
        )
      );
    },
    onSuccess: async () => {
      setLastSavedAt(Date.now());
      clearPendingSaves();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["assignment-students", assignmentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["professor-assignment", assignmentId],
        }),
      ]);
    },
  });

  const actualizarEvaluacion = (studentId: string, nivel: string) => {
    setPendingSave(studentId, nivel as any);
  };

  const guardarEvaluaciones = () => {
    if (Object.keys(pendingSaves).length === 0) return;
    mutation.mutate();
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
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Asignación no encontrada</h2>
            <p className="text-muted-foreground mb-4">
              La asignación solicitada no existe o no tienes acceso.
            </p>
            <Link href="/profesor/evaluaciones">
              <Button>Volver</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/profesor/evaluaciones">
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver
            </Link>
          </Button>
          <PageHeader
            title="Evaluación de Competencias Blandas"
            description={`Evalúa la competencia ${assignment.competencyName} para tus estudiantes`}
          >
            <BookOpen className="h-6 w-6 text-primary" />
          </PageHeader>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl">{assignment.competencyName}</CardTitle>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Progreso: {studentsData?.evaluatedStudentsCount || 0} de {studentsData?.totalStudentsCount || 0}
                </p>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-32" />
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(assignment.competencyLevelDescriptions || {})
                .sort((a, b) => {
                  const order = ["Inicial", "Intermedio", "Avanzado", "Excelente"] as const;
                  return order.indexOf(a[0] as any) - order.indexOf(b[0] as any);
                })
                .map(([nivel, descripcion]) => (
                  <div key={nivel} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getNivelColor(nivel)}`} />
                      <h4 className="font-semibold capitalize text-sm">{nivel}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{descripcion}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 mb-6">
          {students.map((student) => (
            <Card key={student.studentId} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {student.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{student.studentEmail}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {student.competencyLevelDescription}
                    </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {["Inicial", "Intermedio", "Avanzado", "Excelente"].map(
                      (nivel) => (
                        <Button
                          key={nivel}
                          title={
                            assignment.competencyLevelDescriptions?.[nivel] ||
                            undefined
                          }
                          variant={pendingSaves[student.studentId]
                            ? pendingSaves[student.studentId] === nivel
                              ? "default"
                              : "outline"
                            : student.competencyLevel === nivel
                            ? "default"
                            : "outline"}
                          size="sm"
                          className={`min-w-20 ${
                            (pendingSaves[student.studentId]
                              ? pendingSaves[student.studentId] === nivel
                              : student.competencyLevel === nivel)
                              ? getNivelColor(nivel) + " text-white hover:opacity-90"
                              : ""
                          }`}
                          onClick={() => actualizarEvaluacion(student.studentId, nivel)}
                        >
                          <span className="capitalize text-xs">{nivel}</span>
                        </Button>
                      )
                    )}
                    {(pendingSaves[student.studentId] || student.competencyLevel) && (
                      <Badge
                        variant={getNivelBadgeVariant(
                          pendingSaves[student.studentId] || student.competencyLevel
                        )}
                        className="ml-2"
                      >
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={guardarEvaluaciones}
            size="lg"
            className="min-w-48"
            disabled={Object.keys(pendingSaves).length === 0 || mutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {lastSavedAt
              ? "Evaluaciones Guardadas"
              : `Guardar ${Object.keys(pendingSaves).length} Evaluaciones`}
          </Button>
        </div>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}

export default ProfessorEvaluationPage;


