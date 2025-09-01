import { useAuthStore } from "@/features/auth";
import { useState } from "react";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Clock, CheckCircle, Filter } from "lucide-react";
import { useGetAllProfessorAssignments } from "../hooks";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { DataSection } from "@/shared/components/ui/data-section";
import { professorEvaluationColumns } from "../columns";

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

  const getPageTitle = () => {
    switch (statusFilter) {
      case "Pending":
        return "Evaluaciones Pendientes";
      case "Completed":
        return "Evaluaciones Completadas";
      default:
        return "Todas las Evaluaciones";
    }
  };

  const getPageDescription = () => {
    switch (statusFilter) {
      case "Pending":
        return "Evaluaciones de competencias que requieren tu atención";
      case "Completed":
        return "Evaluaciones de competencias que ya has completado";
      default:
        return "Gestiona todas tus evaluaciones de competencias asignadas. Usa los filtros para ver evaluaciones pendientes o completadas.";
    }
  };

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case "Pending":
        return "No tienes evaluaciones pendientes";
      case "Completed":
        return "No has completado ninguna evaluación aún";
      default:
        return "No tienes evaluaciones asignadas";
    }
  };

  const getEmptyIcon = () => {
    switch (statusFilter) {
      case "Pending":
        return <Clock className="w-8 h-8" />;
      case "Completed":
        return <CheckCircle className="w-8 h-8" />;
      default:
        return <Clock className="w-8 h-8" />;
    }
  };

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

          {/* Tabla de Evaluaciones */}
          <DataSection
            title={getPageTitle()}
            description={getPageDescription()}
            data={filteredAssignments}
            columns={professorEvaluationColumns}
            isLoading={isLoading}
            emptyMessage={getEmptyMessage()}
            emptyIcon={getEmptyIcon()}
            className="mb-6"
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
