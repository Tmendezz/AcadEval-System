import { useParams } from "wouter";
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
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  ArrowLeft,
  Target,
  BookOpen,
  GraduationCap,
  Star,
  CheckCircle,
  Calendar,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getStudentEvaluationDetail } from "@/shared/services/student-evaluation-service";

export default function StudentEvaluationDetailPage() {
  const { evaluationId } = useParams();
  const {
    data: evaluationDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-evaluation-detail", evaluationId],
    queryFn: () => getStudentEvaluationDetail(evaluationId || ""),
    enabled: !!evaluationId,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !evaluationDetail) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="space-y-6">
              <Link href="/evaluaciones/alumnos/mis-evaluaciones">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver a Mis Evaluaciones
                </Button>
              </Link>
              <Card className="border-destructive/50">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-lg font-semibold text-destructive">
                    Evaluación no encontrada
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    La evaluación no existe o no tienes permisos para acceder.
                  </p>
                </CardContent>
              </Card>
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  const getCompetencyLevelColor = (level: string) => {
    const colors = {
      Inicial: "bg-red-100 text-red-800 border-red-200",
      Intermedio: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Avanzado: "bg-blue-100 text-blue-800 border-blue-200",
      Excelente: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[level as keyof typeof colors] || colors.Inicial;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
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
            className="bg-orange-100 text-orange-800 border-orange-200"
          >
            <Calendar className="w-3 h-3 mr-1" />
            En Progreso
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header con navegación */}
          <div className="mb-6">
            <Link href="/evaluaciones/alumnos/mis-evaluaciones">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Volver a Mis Evaluaciones
              </Button>
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">
              Detalle de Evaluación
            </h1>
            <p className="text-muted-foreground">
              Revisa el resumen de todas las competencias evaluadas en esta
              instancia
            </p>
          </div>

          {/* Información general de la evaluación */}
          <Card className="mb-6 border-0 bg-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Información de la Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {evaluationDetail.evaluationTitle}
                    </h2>
                    <p className="text-muted-foreground">
                      {evaluationDetail.evaluationDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(evaluationDetail.status)}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          evaluationDetail.periodFrom
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          evaluationDetail.periodTo
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      <strong>Asignaturas:</strong>{" "}
                      {evaluationDetail.subjectsCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      <strong>Competencias:</strong>{" "}
                      {evaluationDetail.competenciesCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      <strong>Profesores:</strong>{" "}
                      {evaluationDetail.professorsCount}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de competencias */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Resumen de Competencias Evaluadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluationDetail.competencies.map((competency, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {competency.competencyName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {competency.competencyDescription}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{competency.subjectName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span>
                              {competency.careerName} - {competency.careerYear}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge
                          variant="outline"
                          className={getCompetencyLevelColor(competency.level)}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {competency.level}
                        </Badge>
                      </div>
                    </div>

                    {competency.observations && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          <strong>Observaciones:</strong>{" "}
                          {competency.observations}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas generales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Estadísticas Generales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">
                    {evaluationDetail.competenciesCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Competencias Evaluadas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">
                    {evaluationDetail.completedCompetencies}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Completadas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">
                    {evaluationDetail.averageLevel}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Nivel Promedio
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progreso general</span>
                  <span>
                    {evaluationDetail.completionPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={evaluationDetail.completionPercentage}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
