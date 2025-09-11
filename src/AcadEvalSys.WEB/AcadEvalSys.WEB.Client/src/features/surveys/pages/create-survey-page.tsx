import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { SurveyForm, SurveyQuestion } from '../models/survey-types';
import { useCreateSurvey } from '../hooks/use-surveys';
import { useSurveyFormValidationBasic } from '../hooks/use-survey-form-validation-basic';
// Settings son internas del wizard
import { SurveyWizard } from '../components/wizard/survey-wizard';
import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
import { useSurveyTemplate } from '../hooks/use-survey-templates';
import { useSurveysStore } from '../store/use-surveys-store';
// Reemplazado por wizard

export default function CreateSurveyPage() {
  const [, setLocation] = useLocation();
  const createSurveyMutation = useCreateSurvey();
  const { selectedTemplateId, setSelectedTemplateId } = useSurveysStore();
  const { data: templateData, isFetching: isFetchingTemplate } = useSurveyTemplate(selectedTemplateId || '', !!selectedTemplateId);

  const [formData] = useState<SurveyForm>({
    title: '',
    description: '',
    questions: [],
  });
  // Configuración gestionada dentro del Wizard

  const { validateForm } = useSurveyFormValidationBasic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    try {
      await createSurveyMutation.mutateAsync(formData);
      setLocation('/encuestas');
    } catch (error) {
    }
  };

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
      {/* Header intencionalmente vacío para evitar redundancia con la sección */}
      <PageContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Wizard de creación */}
          <SurveyWizard
            onSubmit={async ({ form }) => {
              await createSurveyMutation.mutateAsync(form);
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
          />
        </form>
      </PageContent>
      </PageLayout>

    )}
  