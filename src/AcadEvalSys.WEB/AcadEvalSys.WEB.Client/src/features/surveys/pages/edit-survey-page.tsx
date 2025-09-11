import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { SurveyForm } from '../models/survey-types';
import type { SurveyQuestion } from '../models/survey-types';
import { useSurvey, useUpdateSurvey } from '../hooks/use-surveys';
import { useSurveyFormValidationBasic } from '../hooks/use-survey-form-validation-basic';
import { SurveyBasicInfoForm } from '../components/survey-basic-info-form';
import { SurveyQuestionsEditor } from '../components/survey-questions-editor';
import { SurveyFormActionsBasic } from '../components/survey-form-actions-basic';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function EditSurveyPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/editar/:id');
  const surveyId = params?.id;

  const { data: survey, isLoading: isLoadingSurvey, error: surveyError } = useSurvey(surveyId || '');
  const updateSurveyMutation = useUpdateSurvey();

  const [formData, setFormData] = useState<SurveyForm>({
    title: '',
    description: '',
    questions: [],
  });

  const { errors, validateForm, clearErrors } = useSurveyFormValidationBasic();

  // Cargar datos de la encuesta cuando esté disponible
  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
      });
    }
  }, [survey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!surveyId) return;
    
    if (!validateForm(formData)) {
      return;
    }

    try {
      await updateSurveyMutation.mutateAsync({ id: surveyId, survey: formData });
      setLocation('/encuestas');
    } catch (error) {
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

  if (isLoadingSurvey) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando encuesta...</span>
        </div>
      </div>
    );
  }

  if (surveyError || !survey) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error al cargar la encuesta. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editar Encuesta</h1>
          <p className="text-muted-foreground">
            Modifica los detalles y preguntas de tu encuesta
          </p>
        </div>
      </div>

      {updateSurveyMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Error al actualizar la encuesta. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
      )}

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
          title="Preguntas de la Encuesta"
        />

        <SurveyFormActionsBasic
          onCancel={handleCancel}
          submitLabel="Actualizar Encuesta"
          isLoading={updateSurveyMutation.isPending}
        />
      </form>
    </div>
  );
}

  