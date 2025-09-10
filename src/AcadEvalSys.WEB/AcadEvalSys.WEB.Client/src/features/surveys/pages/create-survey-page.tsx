import { useState } from 'react';
import { useLocation } from 'wouter';
import { SurveyForm } from '../models/survey-types';
import { useCreateSurvey } from '../hooks/use-surveys';
import { useSurveyFormValidationBasic } from '../hooks/use-survey-form-validation-basic';
// Settings son internas del wizard
import { SurveyWizard } from '../components/wizard/survey-wizard';
import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
// Reemplazado por wizard

export default function CreateSurveyPage() {
  const [, setLocation] = useLocation();
  const createSurveyMutation = useCreateSurvey();

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
      console.error('Error al crear la encuesta:', error);
    }
  };

  const handleCancel = () => {
    setLocation('/encuestas');
  };

  // Manejo de cambios ahora es interno del Wizard

  return (
    <PageLayout>
      {/* Header intencionalmente vacío para evitar redundancia con la sección */}
      <PageContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Wizard de creación */}
          <SurveyWizard
            onSubmit={async ({ form }) => {
              await createSurveyMutation.mutateAsync(form);
              setLocation('/encuestas');
            }}
            onCancel={handleCancel}
            isSubmitting={createSurveyMutation.isPending}
          />
        </form>
      </PageContent>
      </PageLayout>

    )}
  