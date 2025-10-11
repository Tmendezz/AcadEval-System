import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { CareerYear, CreateAcademicSurveyRequest } from '../models/survey-types';
import { useSurvey, useTechnicalCareers, useUpdateSurvey } from '../hooks/use-surveys';
import { SurveyWizard } from '../components/wizard/survey-wizard';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { convertDateTimeLocalToISO } from '@/shared/utils/date-utils';
import { PageLoader } from '@/shared/components/ui/page-loader';

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
          <PageLoader />
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

            // Validación: asegurar que hay al menos un elemento en audience
            if (audience.length === 0 && careers.length > 0) {
              audience.push({
                technicalCareerId: careers[0].id,
                selectedYears: ['First']
              });
            }

            // Asegurar que las fechas sean válidas y cumplan validaciones del backend
            let publishAtDate = scheduling.publishAt ? convertDateTimeLocalToISO(scheduling.publishAt) : null;
            let closeAtDate = scheduling.closeAt ? convertDateTimeLocalToISO(scheduling.closeAt) : null;
            
            // Si no hay fechas, usar fechas por defecto que cumplan las validaciones
            if (!publishAtDate) {
              const today = new Date();
              publishAtDate = today.toISOString();
            }
            if (!closeAtDate) {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 7); // Una semana después
              closeAtDate = tomorrow.toISOString();
            }

            const payload = {
              title: form.title?.trim() || '',
              description: form.description?.trim() || '',
              publishAt: publishAtDate,
              closeAt: closeAtDate,
              audience: audience || [],
              questions: form.questions?.map(q => {
                const question: any = {
                  text: q.text,
                  type: q.type === 'SingleChoice' ? 0 : q.type === 'MultipleChoice' ? 1 : 2,
                  order: q.order || 0,
                  isRequired: q.required,
                  allowComment: q.allowComment || false,
                  options: q.options.map(o => {
                    const option: any = {
                      text: o.text,
                      value: parseInt(o.value) || 0,
                      order: o.order || 0,
                      allowOpenText: o.allowOpenText || false
                    };
                    // Solo incluir ID si existe y no es una nueva opción
                    if (o.id && !o.id.startsWith('new_')) {
                      option.id = o.id;
                    }
                    return option;
                  })
                };
                // Solo incluir ID si existe y no es una nueva pregunta
                if (q.id && !q.id.startsWith('new_')) {
                  question.id = q.id;
                }
                return question;
              }) || []
            };

            console.log('🔍 Debug UpdateSurvey - Form data:', form);
            console.log('🔍 Debug UpdateSurvey - Payload being sent:', payload);
            console.log('🔍 Debug UpdateSurvey - JSON Payload:', JSON.stringify(payload, null, 2));
            await updateSurveyMutation.mutateAsync({ id: surveyId, survey: payload as unknown as CreateAcademicSurveyRequest });
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

  