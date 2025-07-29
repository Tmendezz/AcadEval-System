import { useParams } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, BookOpen, Plus, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { CareerCoordinatorCard } from "../components/career-coordinator-card";
import { DataSection } from "@/shared/components/ui/data-section";
import { useGetTechnicalCareerById, useSubjectsByYear } from "../hooks";
import { createSubjectColumns } from "../columns";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ImportStudentsButton, YearFilterBadges } from "../components";

export default function SubjectsPage() {
  const { careerId } = useParams();
  const { data: careerData } = useGetTechnicalCareerById(careerId || "");

  const {
    filteredSubjects,
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
        title={careerId ? `${careerData?.name || ""}` : "Asignaturas"}
        description={
          careerId
            ? `Gestión de asignaturas para ${careerData?.name || ""}`
            : "Gestión de asignaturas"
        }
      >
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva asignatura
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        {careerId && (
          <CareerCoordinatorCard
            careerName={careerData?.name || ""}
            coordinator={undefined} // TODO: Get real coordinator
            professors={[]} // TODO: Get professor list
            onAssignCoordinator={async (professorId) => {
              // TODO: Implementar lógica de asignación de coordinador
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

          <DataSection
            title="Lista de Asignaturas"
            description={
              careerId
                ? `Asignaturas de ${careerData?.name || ""}`
                : "Todas las asignaturas del sistema"
            }
            data={filteredSubjects}
            columns={createSubjectColumns(careerId)}
            isLoading={isLoading}
            emptyMessage="No se encontraron asignaturas"
            emptyIcon={<BookOpen className="w-8 h-8" />}
            className="mb-6"
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
