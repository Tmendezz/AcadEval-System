import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import {
  useGetEvaluations,
  useEvaluationFilters,
  useDeleteEvaluation,
} from "../hooks";
import { EvaluationFilters } from "../components";
import { evaluationColumns } from "../components/evaluation-columns";
import { navigate } from "wouter/use-browser-location";
import { PlusCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DataSection } from "@/shared/components/ui/data-section";
import { useState } from "react";
import type { Evaluation } from "@infrastructure/api/types/evaluation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

export default function EvaluationsPage() {
  const { data: evaluations = [], isLoading } = useGetEvaluations();
  const deleteEvaluationMutation = useDeleteEvaluation();

  const {
    filteredData: filteredEvaluations,
    activeFilters,
    updateFilter,
    sortBy,
    setSortBy,
  } = useEvaluationFilters(evaluations as Evaluation[]);

  const [evaluationToDelete, setEvaluationToDelete] =
    useState<Evaluation | null>(null);

  const handleNewEvaluation = () => {
    navigate("/evaluaciones/nueva");
  };

  const _handleDeleteEvaluation = (evaluation: Evaluation) => {
    setEvaluationToDelete(evaluation);
  };

  const confirmDeleteEvaluation = async () => {
    if (!evaluationToDelete) return;

    await deleteEvaluationMutation.mutateAsync(evaluationToDelete.id);
    setEvaluationToDelete(null);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Gestión de Evaluaciones"
        description="Administra evaluaciones basadas en competencias"
      >
        <div className="flex gap-3">
          <Button onClick={handleNewEvaluation}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <PageSection>
          <EvaluationFilters
            statusFilter={activeFilters.status || "all"}
            onStatusFilterChange={(value) => updateFilter("status", value)}
            careerFilter={activeFilters.career || "all"}
            onCareerFilterChange={(value) => updateFilter("career", value)}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            className="mb-6"
          />

          <DataSection
            title="Lista de Evaluaciones"
            description="Gestiona las evaluaciones por competencias"
            data={filteredEvaluations}
            columns={evaluationColumns}
            isLoading={isLoading}
            emptyMessage="No se encontraron evaluaciones"
            emptyIcon="FileBarChart"
            className="mb-6"
          />
        </PageSection>
      </PageContent>

      <Dialog
        open={!!evaluationToDelete}
        onOpenChange={() => setEvaluationToDelete(null)}
      >
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
              onClick={() => setEvaluationToDelete(null)}
              disabled={deleteEvaluationMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteEvaluation}
              disabled={deleteEvaluationMutation.isPending}
            >
              {deleteEvaluationMutation.isPending
                ? "Eliminando..."
                : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
