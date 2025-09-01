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
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Target, Clock, CheckCircle, Star, BookOpen, Eye } from "lucide-react";
import { Link } from "wouter";
import { useStudentReceivedEvaluations } from "../hooks/student-evaluations/use-student-received-evaluations";
import { StudentReceivedEvaluation } from "@/shared/services/student-evaluation-service";

export default function StudentReceivedEvaluationsPage() {
  const { user } = useAuthStore();
  const { data: receivedEvaluations = [], isLoading } =
    useStudentReceivedEvaluations();

  // Agrupar evaluaciones por instancia de evaluación
  const groupedEvaluations = receivedEvaluations.reduce(
    (acc, evaluation) => {
      const key = evaluation.evaluationInstanceTitle;
      if (!acc[key]) {
        acc[key] = {
          title: evaluation.evaluationInstanceTitle,
          description: evaluation.evaluationInstanceDescription,
          evaluations: [],
          status: evaluation.status,
          evaluationId: evaluation.id, // Usar el ID de la evaluación para el enlace
        };
      }
      acc[key].evaluations.push(evaluation);
      return acc;
    },
    {} as Record<
      string,
      {
        title: string;
        description: string;
        evaluations: StudentReceivedEvaluation[];
        status: string;
        evaluationId: string;
      }
    >
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge
            variant="default"
            className="bg-green-500/20 text-green-600 border-green-500/30"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case "Pending":
      case "InProgress":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-500/20 text-orange-600 border-orange-500/30"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompetencyLevelBadge = (level: string) => {
    const colors = {
      Inicial: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Intermedio: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
      Avanzado: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      Excelente: "bg-green-500/20 text-green-600 border-green-500/30",
    };

    return (
      <Badge variant="outline" className={colors[level as keyof typeof colors]}>
        <Star className="w-3 h-3 mr-1" />
        {level}
      </Badge>
    );
  };

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Mis Evaluaciones Recibidas
            </h1>
            <p className="text-muted-foreground">
              Revisa las evaluaciones de competencias que has recibido de tus
              profesores
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Evaluaciones
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {receivedEvaluations.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                    <p className="text-2xl font-bold text-foreground">
                      {
                        receivedEvaluations.filter(
                          (e: StudentReceivedEvaluation) =>
                            e.status === "Completed"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-foreground">
                      {
                        receivedEvaluations.filter(
                          (e: StudentReceivedEvaluation) =>
                            e.status === "Pending" || e.status === "InProgress"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Evaluaciones Agrupadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Evaluaciones por Instancia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedEvaluations).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p>No has recibido evaluaciones aún</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedEvaluations).map(([key, group]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {group.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {group.description}
                          </p>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(group.status)}
                            <span className="text-sm text-muted-foreground">
                              {group.evaluations.length} competencia
                              {group.evaluations.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/evaluaciones/alumnos/mis-evaluaciones/${group.evaluationId}`}
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Ver Detalle
                          </Button>
                        </Link>
                      </div>

                      <div className="space-y-3">
                        {group.evaluations.map(
                          (evaluation: StudentReceivedEvaluation) => (
                            <div
                              key={evaluation.id}
                              className={`p-4 border rounded-lg transition-colors ${
                                evaluation.status === "Completed"
                                  ? "bg-green-50/50 border-green-200/50"
                                  : "hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-foreground text-lg">
                                      {evaluation.competencyName}
                                    </h3>
                                    {getStatusBadge(evaluation.status)}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                      <p>
                                        <strong>Asignatura:</strong>{" "}
                                        {evaluation.subjectName}
                                      </p>
                                      <p>
                                        <strong>Carrera:</strong>{" "}
                                        {evaluation.careerName} -{" "}
                                        {evaluation.year}
                                      </p>
                                      <p>
                                        <strong>Profesor:</strong>{" "}
                                        {evaluation.professorName}
                                      </p>
                                    </div>

                                    {evaluation.status === "Completed" &&
                                      evaluation.competencyLevel && (
                                        <div>
                                          <p>
                                            <strong>Nivel Alcanzado:</strong>
                                          </p>
                                          <div className="mt-1">
                                            {getCompetencyLevelBadge(
                                              evaluation.competencyLevel
                                            )}
                                          </div>
                                          <p className="mt-2">
                                            <strong>Fecha:</strong>{" "}
                                            {evaluation.assessmentDate &&
                                              new Date(
                                                evaluation.assessmentDate
                                              ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )}

                                    {(evaluation.status === "Pending" ||
                                      evaluation.status === "InProgress") &&
                                      evaluation.dueDate && (
                                        <div>
                                          <p>
                                            <strong>Fecha Límite:</strong>{" "}
                                            {new Date(
                                              evaluation.dueDate
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )}
                                  </div>

                                  {evaluation.observations && (
                                    <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                      <p className="text-sm font-medium text-foreground mb-1">
                                        Observaciones:
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {evaluation.observations}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
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
