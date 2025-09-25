import { useMemo } from "react";
import { useLocation } from "wouter";
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
import { CompetencyList } from "../components/CompetencyList";
import { CreateCompetencyModal } from "../components/CreateCompetencyModal";
import { EditCompetencyModal } from "../components/EditCompetencyModal";
// Filtros removidos temporalmente
import { Competency } from "@infrastructure/api/types/competency";

export function CompetenciesPage() {
  const [, setLocation] = useLocation();

  // Hooks de datos
  const { data: competencies = [], isLoading, error } = useCompetencies();
  const createCompetency = useCreateCompetency();
  const updateCompetency = useUpdateCompetency();
  const deleteCompetency = useDeleteCompetency();

  // Store de estado
  const {
    isCreateModalOpen,
    isEditModalOpen,
    selectedCompetency,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
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

  const handleRowClick = (competency: Competency) => {
    setLocation(`/competencias/${competency.id}`);
  };

  const handleEditClick = (competency: Competency) => {
    openEditModal(competency);
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
        <button
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground shadow hover:opacity-90"
          onClick={openCreateModal}
        >
          <span className="i-lucide-plus h-4 w-4"></span>
          Nueva Competencia
        </button>
      </PageHeader>
      <PageContent>
        {/* Lista de competencias */}
        <CompetencyList
          competencies={filteredCompetencies}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteCompetency}
        />

        {/* Modales */}
        <CreateCompetencyModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={handleCreateCompetency}
          isLoading={createCompetency.isPending}
        />

        {selectedCompetency && (
          <EditCompetencyModal
            competency={selectedCompetency}
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSubmit={handleUpdateCompetency}
            isLoading={updateCompetency.isPending}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
