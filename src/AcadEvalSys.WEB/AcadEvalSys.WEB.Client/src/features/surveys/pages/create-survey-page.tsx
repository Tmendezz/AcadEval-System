import { useState } from 'react';
import { useLocation } from 'wouter';
import { SurveyForm, SurveyQuestion } from '../models/survey-types';
import { useCreateSurvey } from '../hooks/use-surveys';
import { useSurveyFormValidationBasic } from '../hooks/use-survey-form-validation-basic';
import { SurveyBasicInfoForm } from '../components/survey-basic-info-form';
import { SurveyQuestionsEditor } from '../components/survey-questions-editor';
import { SurveyFormActionsBasic } from '../components/survey-form-actions-basic';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export default function CreateSurveyPage() {
  const [, setLocation] = useLocation();
  const createSurveyMutation = useCreateSurvey();

  const [formData, setFormData] = useState<SurveyForm>({
    title: '',
    description: '',
    questions: [],
  });

  const { errors, validateForm, clearErrors } = useSurveyFormValidationBasic();

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

  const handleBasicInfoChange = (updates: Partial<SurveyForm>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    clearErrors();
  };

  const handleQuestionsChange = (questions: SurveyQuestion[]) => {
    setFormData(prev => ({ ...prev, questions }));
    clearErrors();
  };

  return (
    <PageLayout>
      <PageHeader
        title="Crear Nueva Encuesta"
        description="Crea una encuesta personalizada con tus propias preguntas"
      >
        <Button onClick={handleSubmit}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Encuesta
        </Button>
      </PageHeader>
      <PageContent>
        <form onSubmit={handleSubmit} className="space-y-6">
        <SurveyBasicInfoForm
          title={formData.title}
          description={formData.description}
          onChange={handleBasicInfoChange}
          errors={errors}
        />

        <SurveyQuestionsEditor
          questions={formData.questions}
          onChange={handleQuestionsChange}
          errors={errors}
        />

        <SurveyFormActionsBasic
          onCancel={handleCancel}
          submitLabel="Crear Encuesta"
          isLoading={createSurveyMutation.isPending}
        />
        </form>
      </PageContent>
      </PageLayout>

    )}
  