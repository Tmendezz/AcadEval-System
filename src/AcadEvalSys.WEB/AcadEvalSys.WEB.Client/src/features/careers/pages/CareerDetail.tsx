import { useParams } from "wouter";
import { useSubjectsByYear } from "../hooks/use-subjects-by-year";
import { createSubjectColumns } from "./subject-columns";
import { DataSection } from "@/shared/components/ui/data-section";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { useGetTechnicalCareerById } from "../hooks/use-technical-careers";
import { useDeleteSubject } from "../hooks/use-delete-subject";
import { CoordinatorCard } from "../components/CoordinatorCard";
import { ImportStudentsToCareerButton } from "../components/import-students-to-career-button";
import { YearFilterTabs } from "../components/year-filter-tabs";

export function CareerDetail() {
  const { careerId } = useParams();

  const { data: careerData, isLoading: isLoadingCareer } =
    useGetTechnicalCareerById(careerId!);

  const deleteSubjectMutation = useDeleteSubject();

  const { filteredSubjects, selectedYear, changeYear, isLoading } =
    useSubjectsByYear(careerId!, {
      includeEnrolledStudents: true,
      enabled: !!careerId,
    });

  if (isLoadingCareer) {
    return (
      <PageLayout>
        <LoadingState message="Cargando detalles de la carrera..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={careerData?.name || "Asignaturas"}
        description={
          careerData
            ? `Gestión de asignaturas para ${careerData.name}`
            : "Gestión de asignaturas"
        }
      />

      <PageContent>
        <CoordinatorCard careerId={careerId!} />
        <PageSection className="space-y-6">
          <div className="flex items-center justify-between">
            <YearFilterTabs
              selectedYear={selectedYear}
              onYearChange={changeYear}
            />
            {careerData && (
              <ImportStudentsToCareerButton
                careerId={careerData.id}
                careerName={careerData.name}
                careerYear={careerData.year}
              />
            )}
          </div>

          <DataSection
            title="Lista de Asignaturas"
            description={
              careerData
                ? `Asignaturas de ${careerData.name}`
                : "Todas las asignaturas del sistema"
            }
            data={filteredSubjects}
            columns={createSubjectColumns(careerId, deleteSubjectMutation)}
            isLoading={isLoading}
            emptyMessage="No se encontraron asignaturas"
            className="mb-6"
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
