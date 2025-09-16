import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCreateSurvey, useTechnicalCareers } from '../hooks/use-surveys';
// Settings son internas del wizard
import { SurveyWizard } from '../components/wizard/survey-wizard';
import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
import { useSurveyTemplate } from '../hooks/use-survey-templates';
import { useSurveysStore } from '../store/use-surveys-store';
import { CareerYear, CreateAcademicSurveyRequest } from '../models/survey-types';
import { convertDateTimeLocalToISO } from '@/shared/utils/date-utils';

export default function CreateSurveyPage() {
  const [, setLocation] = useLocation();
  const createSurveyMutation = useCreateSurvey();
  const { selectedTemplateId, setSelectedTemplateId } = useSurveysStore();
  const { data: templateData, isFetching: isFetchingTemplate } = useSurveyTemplate(selectedTemplateId || '', !!selectedTemplateId);
  const { data: careers = [], isLoading: isLoadingCareers } = useTechnicalCareers();

  // Configuración gestionada dentro del Wizard

  const handleCancel = () => {
    setSelectedTemplateId(null);
    setLocation('/encuestas');
  };

  // Limpiar templateId cuando se complete la creación
  useEffect(() => {
    if (createSurveyMutation.isSuccess) {
      setSelectedTemplateId(null);
    }
  }, [createSurveyMutation.isSuccess, setSelectedTemplateId]);

  // Manejo de cambios ahora es interno del Wizard

  // Mostrar loading mientras se carga la plantilla o las tecnicaturas
  if ((selectedTemplateId && isFetchingTemplate) || isLoadingCareers) {
    return (
      <PageLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {isFetchingTemplate ? 'Cargando plantilla...' : 'Cargando tecnicaturas...'}
              </p>
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        {/* Wizard de creación (sin botón de submit en el page) */}
        <SurveyWizard
          onSubmit={async ({ form, settings, scheduling }) => {
              if (!selectedTemplateId) {
                // TODO: Mostrar un error al usuario
                console.error("Error: No se ha seleccionado una plantilla.");
                return;
              }

              // El backend espera un objeto con `templateId` y `audience`
              // settings.selectedCareerIds contiene las tecnicaturas EXCLUIDAS, necesitamos las INCLUIDAS
              const includedCareerIds = careers
                .filter(career => !settings.selectedCareerIds.includes(career.id))
                .map(career => career.id);
              
              // settings.selectedYears contiene las cohortes EXCLUIDAS, necesitamos las INCLUIDAS
              const allYears: CareerYear[] = [1, 2, 3] as CareerYear[]; // First=1, Second=2, Third=3
              const includedYears = allYears.filter(year => !settings.selectedYears.includes(year));
              
              // Validación: si no hay carreras incluidas, incluir todas por defecto
              const finalCareerIds = includedCareerIds.length > 0 ? includedCareerIds : careers.map(c => c.id);
              const finalYears = includedYears.length > 0 ? includedYears : allYears;
              
              // Crear la estructura de audiencia que espera el backend
              const audience = finalCareerIds.map(careerId => ({
                technicalCareerId: careerId,
                selectedYears: finalYears.map(year => {
                  // Convertir números a enums string para el backend
                  switch(year) {
                    case 1: return 'First';
                    case 2: return 'Second'; 
                    case 3: return 'Third';
                    default: return 'First';
                  }
                })
              }));
              
              const surveyToCreate: CreateAcademicSurveyRequest = {
                title: form.title,
                templateId: selectedTemplateId,
                audience: audience,
                publishAt: convertDateTimeLocalToISO(scheduling.publishAt || ''),
                closeAt: convertDateTimeLocalToISO(scheduling.closeAt || ''),
              };

            await createSurveyMutation.mutateAsync(surveyToCreate);
            setSelectedTemplateId(null);
            setLocation('/encuestas');
          }}
          onCancel={handleCancel}
          isSubmitting={createSurveyMutation.isPending}
          initialTemplate={templateData ? {
            title: templateData.title,
            description: templateData.description,
            questions: templateData.questions,
          } : undefined}
          fixedQuestions={templateData?.questions}
          careers={careers}
        />
      </PageContent>
    </PageLayout>
  );
}