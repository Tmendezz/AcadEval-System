import { useState, useMemo, useCallback } from "react";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { useGetEvaluations, useDeleteEvaluation } from "../hooks";
import { createEvaluationColumns } from "../components/evaluation-columns";
import { navigate } from "wouter/use-browser-location";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DataSection } from "@/shared/components/ui/data-section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { EvaluationListItem } from "@/features/evaluations/services/evaluation-service";

export default function EvaluationsPage() {
  const { data: evaluations = [], isLoading } = useGetEvaluations();
  const deleteEvaluationMutation = useDeleteEvaluation();

  const [evaluationToDelete, setEvaluationToDelete] =
    useState<EvaluationListItem | null>(null);

  // Handlers memoizados
  const handleNewEvaluation = useCallback(() => {
    navigate("/evaluaciones/nueva");
  }, []);

  const handleDeleteEvaluation = useCallback((evaluation: EvaluationListItem) => {
    setEvaluationToDelete(evaluation);
  }, []);

  const confirmDeleteEvaluation = useCallback(async () => {
    if (!evaluationToDelete) return;
    await deleteEvaluationMutation.mutateAsync(evaluationToDelete.id);
    setEvaluationToDelete(null);
  }, [evaluationToDelete, deleteEvaluationMutation]);

  const handleCloseDialog = useCallback(() => {
    setEvaluationToDelete(null);
  }, []);

  // Memoizar columnas
  const columns = useMemo(
    () => createEvaluationColumns({ onDelete: handleDeleteEvaluation }),
    [handleDeleteEvaluation]
  );

  // Memoizar datos filtrados
  const filteredEvaluations = useMemo(
    () => evaluations as EvaluationListItem[],
    [evaluations]
  );

  const handleDeleteEvaluation = (evaluation: EvaluationListItem) => {
    setEvaluationToDelete(evaluation);
  };

  const confirmDeleteEvaluation = async () => {
    if (!evaluationToDelete) return;

    await deleteEvaluationMutation.mutateAsync(evaluationToDelete.id);
    setEvaluationToDelete(null);
  };

  const columns = createEvaluationColumns({
    onDelete: handleDeleteEvaluation,
  });

  return (
    <PageLayout>
      <PageHeader
        title="Gestión de Evaluaciones"
        description="Administra evaluaciones basadas en competencias"
      >
        <div className="flex gap-3">
          <Button onClick={handleNewEvaluation}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <PageSection>
          <DataSection
            data={filteredEvaluations}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No se encontraron evaluaciones"
            emptyIcon="FileBarChart"
            className="py-6"
          />
        </PageSection>
      </PageContent>

      <Dialog open={!!evaluationToDelete} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar evaluación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar la evaluación "
              {evaluationToDelete?.title}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={deleteEvaluationMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteEvaluation}
              disabled={deleteEvaluationMutation.isPending}
            >
              {deleteEvaluationMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

