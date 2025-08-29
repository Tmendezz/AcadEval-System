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
import { Badge } from "@/shared/components/ui/badge";
import { Clock, CheckCircle, ArrowRight, Users, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { useGetAllProfessorAssignments } from "../hooks";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProfessorAllEvaluationsPage() {
  const { user } = useAuthStore();
  const { data: assignments, isLoading } = useGetAllProfessorAssignments();

  const pendingAssignments =
    assignments?.filter((assignment) => assignment.status === "Pending") || [];

  const completedAssignments =
    assignments?.filter((assignment) => assignment.status === "Completed") ||
    [];

  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completada
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

  if (isLoading) {
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
              Gestiona todas tus evaluaciones de competencias asignadas
            </p>
          </div>

          {/* Evaluaciones Pendientes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Evaluaciones Pendientes ({pendingAssignments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p>No tienes evaluaciones pendientes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAssignments.map((assignment) => (
                    <div
                      key={assignment.assignmentId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {assignment.competencyName}
                          </h3>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {assignment.subjectName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {assignment.evaluatedStudentsCount} de{" "}
                            {assignment.totalStudentsCount} evaluados
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/evaluaciones/asignacion/${assignment.assignmentId}`}
                        >
                          Ver Detalle
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
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
                Evaluaciones Completadas ({completedAssignments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p>No has completado ninguna evaluación aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedAssignments.map((assignment) => (
                    <div
                      key={assignment.assignmentId}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {assignment.competencyName}
                          </h3>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {assignment.subjectName}
                          </span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <Users className="w-4 h-4" />✓{" "}
                            {assignment.evaluatedStudentsCount} de{" "}
                            {assignment.totalStudentsCount} evaluados
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/evaluaciones/asignacion/${assignment.assignmentId}`}
                        >
                          Ver Detalles
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
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
