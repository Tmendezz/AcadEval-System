import { useAuthStore } from "@/features/auth";
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
import { Target, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ProfessorPendingEvaluationsPage() {
  const { user } = useAuthStore();

  // Mock data - En producción esto vendría de una API
  const pendingEvaluations = [
    {
      id: "1",
      title: "Evaluación de Competencias TIC - Primer Semestre 2024",
      competency: "Programación Web",
      subject: "Desarrollo Web",
      career: "Tecnicatura en Informática",
      year: "Primer Año",
      studentsCount: 25,
      completedCount: 15,
      dueDate: "2024-12-15",
    },
    {
      id: "2",
      title: "Evaluación de Competencias TIC - Primer Semestre 2024",
      competency: "Bases de Datos",
      subject: "Sistemas de Información",
      career: "Tecnicatura en Informática",
      year: "Segundo Año",
      studentsCount: 20,
      completedCount: 8,
      dueDate: "2024-12-20",
    },
  ];

  const completedEvaluations = [
    {
      id: "3",
      title: "Evaluación de Competencias TIC - Primer Semestre 2024",
      competency: "Algoritmos",
      subject: "Programación I",
      career: "Tecnicatura en Informática",
      year: "Primer Año",
      studentsCount: 30,
      completedCount: 30,
      completedDate: "2024-11-30",
    },
  ];

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Mis Evaluaciones
            </h1>
            <p className="text-muted-foreground">
              Gestiona las evaluaciones de competencias que tienes asignadas
            </p>
          </div>

          {/* Evaluaciones Pendientes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Evaluaciones Pendientes ({pendingEvaluations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingEvaluations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p>No tienes evaluaciones pendientes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingEvaluations.map((evaluation) => (
                    <div
                      key={evaluation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {evaluation.competency}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {evaluation.subject} - {evaluation.career} -{" "}
                          {evaluation.year}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            {evaluation.completedCount} de{" "}
                            {evaluation.studentsCount} estudiantes evaluados
                          </span>
                          <span>
                            Vence:{" "}
                            {new Date(evaluation.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/evaluaciones/${evaluation.id}/asignacion/${evaluation.id}`}>
                            Continuar Evaluando
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evaluaciones Completadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Evaluaciones Completadas ({completedEvaluations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedEvaluations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p>No has completado ninguna evaluación aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedEvaluations.map((evaluation) => (
                    <div
                      key={evaluation.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {evaluation.competency}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {evaluation.subject} - {evaluation.career} -{" "}
                          {evaluation.year}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="text-green-600 font-medium">
                            ✓ {evaluation.completedCount} de{" "}
                            {evaluation.studentsCount} estudiantes evaluados
                          </span>
                          <span>
                            Completada:{" "}
                            {new Date(
                              evaluation.completedDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/evaluaciones/${evaluation.id}/asignacion/${evaluation.id}`}>
                            Ver Detalles
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
