import { useState } from 'react';
import { useLocation } from 'wouter';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { UserRole } from '@infrastructure/api/types/auth';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';

// Componentes
import MySurveysPage from './my-surveys-page';
import { SurveyList } from '../components/SurveyList';
import { useSurveys } from '../hooks/use-surveys';
import { SurveyStatus } from '../models/survey-types';

/**
 * Página principal de encuestas que detecta el rol del usuario
 * y muestra la vista apropiada:
 * - Admin/Coordinador: Vista administrativa completa  
 * - Estudiante/Profesor: Vista de "Mis Encuestas"
 */
export default function SurveysPage() {
  const { can } = usePermissions();

  // Si es estudiante o profesor, mostrar solo sus encuestas
  if (!can([UserRole.Admin, UserRole.Coordinator])) {
    return <MySurveysPage />;
  }

  // Vista administrativa para Admin y Coordinador
  return <AdminSurveysView />;
}

// Componente de vista administrativa
function AdminSurveysView() {
  const [filters] = useState({
    status: undefined as SurveyStatus | undefined,
    search: '',
  });

  const [, setLocation] = useLocation();
  const { data: surveys = [], isLoading, error } = useSurveys(filters);
  
  // Debug: verificar estructura de datos
  console.log('Surveys data:', surveys);

  const handleEditSurvey = (survey: any) => {
    setLocation(`/encuestas/editar/${survey.id}`);
  };

  const handleViewProgress = (survey: any) => {
    setLocation(`/encuestas/progreso/${survey.id}`);
  };

  const handleDeleteSurvey = (survey: any) => {
    // TODO: Implementar confirmación y lógica de eliminación
    if (confirm(`¿Estás seguro de que deseas eliminar la encuesta "${survey.title}"?`)) {
      console.log('Eliminar encuesta:', survey.id);
      // Aquí iría la llamada a la API para eliminar
    }
  };

  const handleCreateSurvey = () => {
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
          onDelete={handleDeleteSurvey}
        />
      </PageContent>
    </PageLayout>
  );
}