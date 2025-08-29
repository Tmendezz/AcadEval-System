import { useAuthStore } from "@/features/auth";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
  BookOpen,
  Filter,
} from "lucide-react";
import { Link } from "wouter";
import { useGetAllProfessorAssignments } from "../hooks";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProfessorAllEvaluationsPage() {
  const { user } = useAuthStore();
  const { data: assignments, isLoading } = useGetAllProfessorAssignments();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filtrar asignaciones según el filtro seleccionado
  const filteredAssignments =
    assignments?.filter((assignment) => {
      if (statusFilter === "all") return true;
      return assignment.status === statusFilter;
    }) || [];

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
              Mis Evaluaciones de Competencias
            </h1>
            <p className="text-muted-foreground">
              Gestiona todas tus evaluaciones de competencias asignadas. Usa los
              filtros para ver evaluaciones pendientes o completadas.
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Filtrar por:
              </span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las evaluaciones</SelectItem>
                <SelectItem value="Pending">Solo pendientes</SelectItem>
                <SelectItem value="Completed">Solo completadas</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-muted-foreground">
              {filteredAssignments.length} de {assignments?.length || 0}{" "}
              evaluaciones
            </div>
          </div>

          {/* Lista de Evaluaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {statusFilter === "all" && (
                  <>
                    <Clock className="w-5 h-5 text-blue-500" />
                    Todas las Evaluaciones ({filteredAssignments.length})
                  </>
                )}
                {statusFilter === "Pending" && (
                  <>
                    <Clock className="w-5 h-5 text-orange-500" />
                    Evaluaciones Pendientes ({filteredAssignments.length})
                  </>
                )}
                {statusFilter === "Completed" && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Evaluaciones Completadas ({filteredAssignments.length})
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {statusFilter === "all" && (
                    <>
                      <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p>No tienes evaluaciones asignadas</p>
                    </>
                  )}
                  {statusFilter === "Pending" && (
                    <>
                      <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p>No tienes evaluaciones pendientes</p>
                    </>
                  )}
                  {statusFilter === "Completed" && (
                    <>
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p>No has completado ninguna evaluación aún</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.assignmentId}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        assignment.status === "Completed"
                          ? "bg-green-50/50 hover:bg-green-50/70"
                          : "hover:bg-muted/50"
                      }`}
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
                          <span
                            className={`flex items-center gap-1 ${
                              assignment.status === "Completed"
                                ? "text-green-600 font-medium"
                                : ""
                            }`}
                          >
                            <Users className="w-4 h-4" />
                            {assignment.status === "Completed" && "✓ "}
                            {assignment.evaluatedStudents} de{" "}
                            {assignment.totalStudents} evaluados
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/evaluaciones/asignacion/${assignment.assignmentId}`}
                        >
                          {assignment.status === "Completed"
                            ? "Ver Detalles"
                            : "Continuar Evaluando"}
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
