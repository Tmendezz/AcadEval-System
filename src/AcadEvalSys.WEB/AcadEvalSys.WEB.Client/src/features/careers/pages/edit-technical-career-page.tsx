import { useParams } from "wouter";
import { Button } from "@/shared/components/ui/button";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { useEditCareer } from "../hooks/use-edit-career";
import { CareerNameSection } from "../components/career-name-section";
import { CoordinatorSection } from "../components/coordinator-section";
import { SubjectsYearSection } from "../components/subjects-year-section";

export default function EditTechnicalCareerPage() {
  const { careerId } = useParams();

  const {
    // Data
    currentCoordinator,
    coordinatorCandidates,
    existingProfessors,

    // State
    name,
    setName,
    rows,
    selectedCoordinator,
    setSelectedCoordinator,
    search,
    setSearch,
    isSearching,

    // Mutations
    saveMutation,

    // Helper functions
    updateSubjectName,
    updateSubjectProfessor,
    handleDeleteSubject,
  } = useEditCareer(careerId);

  return (
    <PageLayout>
      <PageHeader
        title="Editar Tecnicatura"
        description="Actualiza datos y profesores"
      />
      <PageContent className="space-y-6">
        <CareerNameSection name={name} onNameChange={setName} />

        <CoordinatorSection
          currentCoordinator={currentCoordinator}
          selectedCoordinator={selectedCoordinator}
          onCoordinatorChange={setSelectedCoordinator}
          coordinatorCandidates={coordinatorCandidates}
        />

        {(["First", "Second", "Third"] as const).map((year) => (
          <SubjectsYearSection
            key={year}
            year={year}
            subjects={rows}
            existingProfessors={existingProfessors}
            search={search}
            isSearching={isSearching}
            onSearchChange={setSearch}
            onSubjectNameChange={updateSubjectName}
            onSubjectProfessorChange={updateSubjectProfessor}
            onSubjectDelete={handleDeleteSubject}
          />
        ))}

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            Guardar cambios
          </Button>
        </div>
      </PageContent>
    </PageLayout>
  );
}
