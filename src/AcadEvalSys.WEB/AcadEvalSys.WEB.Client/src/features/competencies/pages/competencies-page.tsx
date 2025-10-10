import { useMemo } from "react";
    
import { toast } from "sonner";
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
import {Competency} from "@features/competencies";
  import { DataSection } from "@/shared/components/ui/data-section";
import { createCompetencyColumns } from "../components/competency-columns";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
// Filtros removidos temporalmente

export function CompetenciesPage() {
 

  // Hooks de datos
  const { data: competencies = [], isLoading, error } = useCompetencies();
  const createCompetency = useCreateCompetency();
  const updateCompetency = useUpdateCompetency();
  const deleteCompetency = useDeleteCompetency();

  // Store de estado
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    selectedCompetency,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
  } = useCompetenciesStore();

  // Lógica de filtrado
  const filteredCompetencies = useMemo(() => {
    return competencies as Competency[];
  }, [competencies]);

  // Handlers de acciones
  const handleCreateCompetency = (data: CompetencyFormData) => {
    createCompetency.mutate(data, {
      onSuccess: () => {
        toast.success("Competencia creada correctamente.");
        closeCreateModal();
      },
      onError: () => {
        toast.error("Error al crear la competencia.");
      },
    });
  };

  const handleUpdateCompetency = (data: CompetencyFormData) => {
    if (!selectedCompetency) return;

    updateCompetency.mutate(
      { id: selectedCompetency.id, data },
      {
        onSuccess: () => {
          toast.success("Competencia actualizada correctamente.");
          closeEditModal();
        },
        onError: () => {
          toast.error("Error al actualizar la competencia.");
        },
      }
    );
  };

  const handleDeleteCompetency = (competencyId: string) => {
    deleteCompetency.mutate(competencyId, {
      onSuccess: () => {
        toast.success("Competencia eliminada correctamente.");
      },
      onError: () => {
        toast.error("Error al eliminar la competencia.");
      },
    });
  };

 

 

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
          columns={createCompetencyColumns({
            onViewClick: openViewModal,
            onEditClick: openEditModal,
            onDeleteClick: handleDeleteCompetency,
          })}
          isLoading={isLoading}
          emptyMessage="No se encontraron competencias"
          className="py-6"
        />

        {/* Modales */}
        <CreateCompetencyModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={handleCreateCompetency}
          isLoading={createCompetency.isPending}
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
              isLoading={updateCompetency.isPending}
            />
          </>
        )}
      </PageContent>
    </PageLayout>
  );
}
