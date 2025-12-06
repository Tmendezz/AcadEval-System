import { useMemo, useCallback } from "react";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import {
  useCompetencies,
  useCreateCompetency,
  useUpdateCompetency,
  useDeleteCompetency,
  CompetencyFormData,
} from "@/features/competencies/hooks/use-competencies";
import { useCompetenciesStore } from "@/shared/stores/use-competencies-store";
import { CreateCompetencyModal } from "../components/CreateCompetencyModal";
import { EditCompetencyModal } from "../components/EditCompetencyModal";
import { ViewCompetencyModal } from "../components/ViewCompetencyModal";
import { Competency } from "@features/competencies";
import { DataSection } from "@/shared/components/ui/data-section";
import { createCompetencyColumns } from "../components/competency-columns";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

export function CompetenciesPage() {
  // Hooks de datos
  const { data: competencies = [], isLoading, error } = useCompetencies();
  const createCompetencyMutation = useCreateCompetency();
  const updateCompetencyMutation = useUpdateCompetency();
  const deleteCompetencyMutation = useDeleteCompetency();

  // Store de estado - selectores individuales para evitar re-renders
  const isCreateModalOpen = useCompetenciesStore((s) => s.isCreateModalOpen);
  const isEditModalOpen = useCompetenciesStore((s) => s.isEditModalOpen);
  const isViewModalOpen = useCompetenciesStore((s) => s.isViewModalOpen);
  const selectedCompetency = useCompetenciesStore((s) => s.selectedCompetency);
  const openCreateModal = useCompetenciesStore((s) => s.openCreateModal);
  const closeCreateModal = useCompetenciesStore((s) => s.closeCreateModal);
  const openEditModal = useCompetenciesStore((s) => s.openEditModal);
  const closeEditModal = useCompetenciesStore((s) => s.closeEditModal);
  const openViewModal = useCompetenciesStore((s) => s.openViewModal);
  const closeViewModal = useCompetenciesStore((s) => s.closeViewModal);

  // Lógica de filtrado memoizada
  const filteredCompetencies = useMemo(
    () => competencies as Competency[],
    [competencies]
  );

  // Handlers memoizados
  const handleCreateCompetency = useCallback(
    (data: CompetencyFormData) => {
      createCompetencyMutation.mutate(data, {
        onSuccess: () => closeCreateModal(),
      });
    },
    [createCompetencyMutation, closeCreateModal]
  );

  const handleUpdateCompetency = useCallback(
    (data: CompetencyFormData) => {
      if (!selectedCompetency) return;
      updateCompetencyMutation.mutate(
        { id: selectedCompetency.id, data },
        { onSuccess: () => closeEditModal() }
      );
    },
    [selectedCompetency, updateCompetencyMutation, closeEditModal]
  );

  const handleDeleteCompetency = useCallback(
    (competencyId: string) => {
      deleteCompetencyMutation.mutate(competencyId);
    },
    [deleteCompetencyMutation]
  );

  // Columnas memoizadas
  const columns = useMemo(
    () =>
      createCompetencyColumns({
        onViewClick: openViewModal,
        onEditClick: openEditModal,
        onDeleteClick: handleDeleteCompetency,
      }),
    [openViewModal, openEditModal, handleDeleteCompetency]
  );



  if (error) {
    return (
      <PageLayout>
        <PageHeader
          title="Gestión de Competencias"
          description="Administra las competencias generales y específicas del sistema."
        />
        <PageContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error al cargar las competencias</p>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Gestión de Competencias"
        description="Administra las competencias generales y específicas del sistema."
      >
        <Button
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground shadow hover:opacity-90"
         
          onClick={openCreateModal}
        >
          <Plus className="h-4 w-4" />
          Nueva Competencia
        </Button>
      </PageHeader>
      <PageContent>
        <DataSection
          data={filteredCompetencies}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No se encontraron competencias"
          className="py-6"
        />

        {/* Modales */}
        <CreateCompetencyModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={handleCreateCompetency}
          isLoading={createCompetencyMutation.isPending}
        />

        {selectedCompetency && (
          <>
            <ViewCompetencyModal
              competency={selectedCompetency}
              isOpen={isViewModalOpen}
              onClose={closeViewModal}
            />
            
            <EditCompetencyModal
              competency={selectedCompetency}
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              onSubmit={handleUpdateCompetency}
              isLoading={updateCompetencyMutation.isPending}
            />
          </>
        )}
      </PageContent>
    </PageLayout>
  );
}
