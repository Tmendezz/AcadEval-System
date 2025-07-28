import { Button } from "@/shared/components/ui/button";
import {
  Plus,
  ArrowLeft,
  BookOpen,
  Users,
  GraduationCap,
  Building,
} from "lucide-react";
import { useGetTechnicalCareers } from "../hooks/use-technical-careers";
import { useGetTechnicalCareerById } from "../hooks/use-technical-careers";
import { useSubjectsByYear } from "../hooks/use-subjects-by-year";
import { useParams } from "wouter";
import { navigate } from "wouter/use-browser-location";
import { CareerYear, CareerYearLabels } from "@/shared/types/enums";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { StatCard } from "@/shared/components/ui/stat-card";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { DataTable } from "@/shared/components/data-table/data-table";
import { createSubjectColumns } from "../columns/subject-columns";
import { CareerCoordinatorCard, ImportStudentsButton } from "../components";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { YearFilterBadges } from "../components/year-filter-badges";
import { useQueryClient } from "@tanstack/react-query";

export default function SubjectsPage() {
  const { careerId } = useParams();
  const queryClient = useQueryClient();

  // Obtener datos de la carrera desde el caché
  const career = queryClient.getQueryData([
    "technical-career",
    careerId,
  ]) as any;

  // Si no hay datos en caché, hacer la consulta
  const { data: careerData } = useGetTechnicalCareerById(careerId || "");

  // Usar datos del caché o de la consulta
  const careerInfo = career || careerData;

  const {
    filteredSubjects,
    totalStats,
    selectedYear,
    searchTerm,
    changeYear,
    setSearch,
    isLoading,
  } = useSubjectsByYear(careerId || "", {
    includeEnrolledStudents: true,
    enabled: !!careerId,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Cargando asignaturas..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={
          careerId ? `Asignaturas - ${careerInfo?.name || ""}` : "Asignaturas"
        }
        description={
          careerId
            ? `Gestión de asignaturas para ${careerInfo?.name || ""}`
            : "Gestión de asignaturas"
        }
      >
        <div className="flex gap-2">
          {careerId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          )}
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva asignatura
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        {careerId && (
          <CareerCoordinatorCard
            careerName={careerInfo?.name || ""}
            coordinator={undefined} // TODO: Get real coordinator
            professors={[]} // TODO: Get professor list
            onAssignCoordinator={async (professorId) => {
              console.log(
                "Assign coordinator:",
                professorId,
                "for career:",
                careerId
              );
            }}
          />
        )}
        <PageSection className="space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar asignaturas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {careerId && (
            <div className="flex justify-between">
              <YearFilterBadges
                onYearChange={changeYear}
                selectedYear={selectedYear}
              />
              <ImportStudentsButton
                onImport={() =>
                  console.log("Import students for career:", careerId)
                }
              />
            </div>
          )}

          <DataTable
            columns={createSubjectColumns(careerId)}
            data={filteredSubjects}
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
