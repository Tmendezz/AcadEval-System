import { useParams } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { BookOpen, Plus, Search } from "lucide-react";
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
import {
  ImportStudentsToCareerButton,
  AddStudentButton,
  YearFilterBadges,
} from "../components";
import {
  SubjectFormDialog,
  SubjectFormValues,
} from "../components/subject-form-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as subjectService from "@/shared/services/subject-service";
import { useState } from "react";

export default function CareerPage() {
  const queryClient = useQueryClient();
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

  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);

  const createSubject = useMutation({
    mutationFn: async (values: SubjectFormValues) => {
      if (!careerId) return;
      await subjectService.createSubject(careerId, {
        name: values.name,
        description: values.description,
        year: values.year as any,
        professorId: values.professorId,
      } as any);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subjects", careerId] });
      setIsSubjectDialogOpen(false);
    },
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
          <Button onClick={() => setIsSubjectDialogOpen(true)}>
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
              <div className="flex gap-2">
                <AddStudentButton
                  careerId={careerId}
                  careerName={careerData?.name || ""}
                />
                <ImportStudentsToCareerButton
                  careerId={careerId}
                  careerName={careerData?.name || ""}
                />
              </div>
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

      <SubjectFormDialog
        open={isSubjectDialogOpen}
        onOpenChange={setIsSubjectDialogOpen}
        onSubmit={(v) => createSubject.mutate(v)}
      />
    </PageLayout>
  );
}
