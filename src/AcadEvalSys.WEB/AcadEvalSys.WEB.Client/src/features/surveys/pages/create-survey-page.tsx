import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCreateSurvey } from '../hooks/use-surveys';
import { useSurveyFormValidationBasic } from '../hooks/use-survey-form-validation-basic';
// Settings son internas del wizard
import { SurveyWizard } from '../components/wizard/survey-wizard';
import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
import { useSurveyTemplate } from '../hooks/use-survey-templates';
import { useSurveysStore } from '../store/use-surveys-store';
import { SurveyForm, SurveyQuestion } from '..';
import { TechnicalCareer } from '../components/survey-audience-selector';
// Reemplazado por wizard

export default function CreateSurveyPage() {
  const [, setLocation] = useLocation();
  const createSurveyMutation = useCreateSurvey();
  const { selectedTemplateId, setSelectedTemplateId } = useSurveysStore();
  const { data: templateData, isFetching: isFetchingTemplate } = useSurveyTemplate(selectedTemplateId || '', !!selectedTemplateId);

  // Datos mock para carreras técnicas y años
  const careers: TechnicalCareer[] = [
    { id: '1', name: 'Tecnicatura en Desarrollo de Software' },
    { id: '2', name: 'Tecnicatura en Redes y Telecomunicaciones' },
    { id: '3', name: 'Tecnicatura en Sistemas' },
    { id: '4', name: 'Tecnicatura en Seguridad Informática' },
  ];

  const years = [1, 2, 3];

  const [formData] = useState<SurveyForm>({
    title: '',
    description: '',
    questions: [],
  });
  // Configuración gestionada dentro del Wizard

  const { validateForm } = useSurveyFormValidationBasic();

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

  // Mostrar loading mientras se carga la plantilla
  if (selectedTemplateId && isFetchingTemplate) {
    return (
      <PageLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando plantilla...</p>
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
          onSubmit={async ({ form, settings }) => {
              if (!selectedTemplateId) {
                // TODO: Mostrar un error al usuario
                console.error("Error: No se ha seleccionado una plantilla.");
                return;
              }

              // El backend espera un objeto con `templateId`, no la lista de preguntas.
              const surveyToCreate = {
                title: form.title,
                description: form.description, // La descripción no se usa en el comando de backend, pero la dejamos por si acaso
                templateId: selectedTemplateId,
                audiences: settings.selectedAudiences.map(a => ({
                  careerId: a.careerId,
                  year: a.year
                })), 
              };

            await createSurveyMutation.mutateAsync(surveyToCreate as any);
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
          fixedQuestions={templateData ? (templateData.questions as unknown as SurveyQuestion[]) : undefined}
          careers={careers}
          years={years}
        />
      </PageContent>
    </PageLayout>
  );
}