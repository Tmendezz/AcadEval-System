import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { CareerYear, CreateAcademicSurveyRequest } from '../models/survey-types';
import { useSurvey, useTechnicalCareers, useUpdateSurvey } from '../hooks/use-surveys';
import { SurveyWizard } from '../components/wizard/survey-wizard';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { convertDateTimeLocalToISO } from '@/shared/utils/date-utils';

export default function EditSurveyPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/editar/:id');
  const surveyId = params?.id || '';

  const { data: survey, isLoading: isLoadingSurvey, error: surveyError } = useSurvey(surveyId);
  const { data: careers = [], isLoading: isLoadingCareers } = useTechnicalCareers();
  const updateSurveyMutation = useUpdateSurvey();

  // Redirigir al listado después de actualizar
  useEffect(() => {
    if (updateSurveyMutation.isSuccess) {
      setLocation('/encuestas');
    }
  }, [updateSurveyMutation.isSuccess, setLocation]);

  if (isLoadingSurvey || isLoadingCareers) {
    return (
      <PageLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando encuesta...</p>
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  if (surveyError || !survey) {
    return (
      <PageLayout>
        <PageContent>
          <Alert variant="destructive">
            <AlertDescription>
              Error al cargar la encuesta. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader title="Editar Encuesta" description="Modifica título, descripción, preguntas, audiencia y fechas" />
      <PageContent>
        <SurveyWizard
          onSubmit={async ({ form, settings, scheduling }) => {
            // Convertir exclusiones a inclusiones (misma lógica que en creación)
            const includedCareerIds = careers
              .filter(career => !settings.selectedCareerIds.includes(career.id))
              .map(career => career.id);

            const allYears: CareerYear[] = [1, 2, 3] as CareerYear[];
            const includedYears = allYears.filter(year => !settings.selectedYears.includes(year));

            const finalCareerIds = includedCareerIds.length > 0 ? includedCareerIds : careers.map(c => c.id);
            const finalYears = includedYears.length > 0 ? includedYears : allYears;

            const audience = finalCareerIds.map(careerId => ({
              technicalCareerId: careerId,
              selectedYears: finalYears.map(year => {
                switch (year) {
                  case 1: return 'First';
                  case 2: return 'Second';
                  case 3: return 'Third';
                  default: return 'First';
                }
              })
            }));

            const payload: CreateAcademicSurveyRequest = {
              title: form.title,
              templateId: survey.templateId,
              publishAt: convertDateTimeLocalToISO(scheduling.publishAt || ''),
              closeAt: convertDateTimeLocalToISO(scheduling.closeAt || ''),
              audience,
            };

            await updateSurveyMutation.mutateAsync({ id: surveyId, survey: payload });
          }}
          onCancel={() => setLocation('/encuestas')}
          isSubmitting={updateSurveyMutation.isPending}
          initialTemplate={{
            title: survey.title,
            description: survey.description || '',
            questions: (survey as any).questions || [],
          }}
          // Permitimos editar preguntas en esta pantalla (no fijamos preguntas)
          careers={careers}
          initialScheduling={{ publishAt: survey.publishAt || '', closeAt: survey.closeAt || '' }}
        />
      </PageContent>
    </PageLayout>
  );
}

  