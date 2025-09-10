import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { useCreateSurveyTemplate } from '../hooks/use-survey-templates';
import { useSurveyFormValidation } from '../hooks/use-survey-form-validation';
import { SurveyTemplateForm, SurveyTemplateType } from '../models/survey-template-types';
import { SurveyBasicInfo } from '../components/survey-basic-info';
import { SurveyQuestionsEditor } from '../components/survey-questions-editor';
import { SurveyFormActions } from '../components/survey-form-actions';

export default function CreateTemplatePage() {
  const [, setLocation] = useLocation();
  const createTemplate = useCreateSurveyTemplate();
  const { errors, validateForm, clearErrors } = useSurveyFormValidation();

  const [formData, setFormData] = useState<SurveyTemplateForm>({
    title: '',
    description: '',
    surveyType: SurveyTemplateType.Student,
    isDraft: true,
    questions: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();
    
    if (validateForm(formData)) {
      try {
        await createTemplate.mutateAsync(formData);
        setLocation('/templates');
      } catch (error) {
        // El error ya se maneja en el hook
      }
    }
  };

  const handleBasicInfoChange = (updates: Partial<SurveyTemplateForm>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleQuestionsChange = (questions: any[]) => {
    setFormData(prev => ({ ...prev, questions }));
  };

  const handleCancel = () => {
    setLocation('/templates');
  };

  return (
    <PageLayout>
      <PageHeader
        title="Crear Nueva Plantilla"
        description="Crea una nueva plantilla de encuesta con preguntas personalizadas"
      />
      
      <PageContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <SurveyBasicInfo
            data={formData}
            onChange={handleBasicInfoChange}
            errors={errors}
          />

          <SurveyQuestionsEditor
            questions={formData.questions}
            onChange={handleQuestionsChange}
            errors={errors}
          />

          <SurveyFormActions
            onCancel={handleCancel}
            onSubmit={() => {}}
            isLoading={createTemplate.isPending}
            submitText="Guardar Plantilla"
          />
        </form>
      </PageContent>
    </PageLayout>
  );
}
