import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';

// Componentes
import { SurveyList } from '../components/SurveyList';
import { useSurveys } from '../hooks/use-surveys';
import { SurveyStatus } from '../models/survey-types';
import { useSurveysStore } from '../store/use-surveys-store';

export default function SurveysPage() {
  const [filters] = useState({
    status: undefined as SurveyStatus | undefined,
    search: '',
  });

  const [, setLocation] = useLocation();
  const { data: surveys = [], isLoading, error } = useSurveys(filters);

  const handleEditSurvey = (survey: any) => {
    setLocation(`/encuestas/editar/${survey.id}`);
  };

  const handleViewProgress = (survey: any) => {
    setLocation(`/encuestas/progreso/${survey.id}`);
  };

  const handleViewResults = (survey: any) => {
    setLocation(`/encuestas/resultados/${survey.id}`);
  };

  const handleDeleteSurvey = (survey: any) => {
    // TODO: Implementar confirmación y lógica de eliminación
    if (confirm(`¿Estás seguro de que deseas eliminar la encuesta "${survey.title}"?`)) {
      console.log('Eliminar encuesta:', survey.id);
      // Aquí iría la llamada a la API para eliminar
    }
  };

  const handleCreateSurvey = () => {
    // Limpiar cualquier template previamente seleccionada antes de navegar
    const { clearCreateState } = useSurveysStore.getState();
    clearCreateState();
    setLocation('/encuestas/crear');
  };

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
        <SurveyList
          surveys={surveys}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditSurvey}
          onViewProgress={handleViewProgress}
          onViewResults={handleViewResults}
          onDelete={handleDeleteSurvey}
        />
      </PageContent>
    </PageLayout>
  );
}