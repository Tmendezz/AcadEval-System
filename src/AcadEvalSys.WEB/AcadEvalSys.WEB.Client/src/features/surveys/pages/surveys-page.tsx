import { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';

// Componentes
import { SurveyList } from '../components/SurveyList';
import { useSurveys, useDeleteSurvey, usePublishSurvey } from '../hooks/use-surveys';
import { SurveyStatus } from '../models/survey-types';
import { useSurveysStore } from '../store/use-surveys-store';
import { SurveyListItem } from '../services/survey-service';
import { createSurveyColumns } from '../components/columns/survey-columns';
import { DataSection } from '@/shared/components/ui/data-section';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader } from '@/shared/components/ui/dialog';

export default function SurveysPage() {
  const [filters] = useState({
    status: undefined as SurveyStatus | undefined,
    search: '',
  });

  const [, setLocation] = useLocation();
  const { data: surveys = [], isLoading, error } = useSurveys(filters);
  const deleteSurveyMutation = useDeleteSurvey();
  const publishSurveyMutation = usePublishSurvey();
  
  const [surveyToDelete, setSurveyToDelete] = useState<SurveyListItem | null>(null);

  const handleEditSurvey = useCallback((survey: SurveyListItem) => {
    setLocation(`/encuestas/editar/${survey.id}`);
  }, [setLocation]);

  const handleViewProgress = useCallback((survey: SurveyListItem) => {
    setLocation(`/encuestas/progreso/${survey.id}`);
  }, [setLocation]);

  const handleViewResults = useCallback((survey: SurveyListItem) => {
    setLocation(`/encuestas/resultados/${survey.id}`);
  }, [setLocation]);

  const handleDeleteSurvey = useCallback((survey: SurveyListItem) => {
    setSurveyToDelete(survey);
  }, []);

  const handlePublishSurvey = useCallback(async (survey: SurveyListItem) => {
    try {
      await publishSurveyMutation.mutateAsync({ 
        id: survey.id,
        command: {} // Publicar sin fecha de cierre específica
      });
    } catch {
      // El error ya se maneja en el hook con toast
    }
  }, [publishSurveyMutation]);

  const confirmDeleteSurvey = useCallback(async () => {
    if (!surveyToDelete) return;

    try {
      await deleteSurveyMutation.mutateAsync(surveyToDelete.id);
      setSurveyToDelete(null);
    } catch {
      // Silently handle delete errors
    }
  }, [surveyToDelete, deleteSurveyMutation]);

  const handleCreateSurvey = useCallback(() => {
    // Limpiar cualquier template previamente seleccionada antes de navegar
    const { clearCreateState } = useSurveysStore.getState();
    clearCreateState();
    setLocation('/encuestas/crear');
  }, [setLocation]);

  const columns = useMemo(
    () =>
      createSurveyColumns({
        onEdit: handleEditSurvey,
        onViewProgress: handleViewProgress,
        onViewResults: handleViewResults,
        onDelete: handleDeleteSurvey,
        onPublish: handlePublishSurvey,
      }),
    [handleEditSurvey, handleViewProgress, handleViewResults, handleDeleteSurvey, handlePublishSurvey]
  );

  return (
    <PageLayout>
      <PageHeader
        title="Gestión de Encuestas"
        description="Administra todas las encuestas académicas del sistema"
      >
        <Button onClick={handleCreateSurvey} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Encuesta
        </Button>
      </PageHeader>
      <PageContent>
        <DataSection
          data={surveys}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No se encontraron encuestas"
          emptyIcon="FileBarChart"
          className="py-6"
        />
      </PageContent>

      <Dialog
        open={!!surveyToDelete}
        onOpenChange={() => setSurveyToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar encuesta</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar la encuesta "
              {surveyToDelete?.title}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSurveyToDelete(null)}
              disabled={deleteSurveyMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSurvey}
              disabled={deleteSurveyMutation.isPending}
            >
              {deleteSurveyMutation.isPending
                ? "Eliminando..."
                : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}