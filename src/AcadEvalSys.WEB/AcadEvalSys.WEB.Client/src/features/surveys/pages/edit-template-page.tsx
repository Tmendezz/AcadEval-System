import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { useSurveyTemplate, useUpdateSurveyTemplate } from '../hooks/use-survey-templates';
import { useSurveyFormValidation } from '../hooks/use-survey-form-validation';
import { SurveyTemplateForm, SurveyTemplateType } from '../models/survey-template-types';
import { SurveyBasicInfo } from '../components/survey-basic-info';
import { SurveyQuestionsEditor } from '../components/survey-questions-editor';
import { SurveyFormActions } from '../components/survey-form-actions';

export default function EditTemplatePage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/templates/editar/:id');
  const id = params?.id;
  const { data: template, isLoading, error } = useSurveyTemplate(id!);
  const updateTemplate = useUpdateSurveyTemplate();
  const { errors, validateForm, clearErrors } = useSurveyFormValidation();

  const [formData, setFormData] = useState<SurveyTemplateForm>({
    title: '',
    description: '',
    surveyType: SurveyTemplateType.Student,
    isDraft: true,
    questions: [],
  });

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title,
        description: template.description,
        surveyType: template.surveyType,
        isDraft: template.isDraft,
        questions: template.questions,
      });
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();
    
    if (validateForm(formData) && id) {
      try {
        await updateTemplate.mutateAsync({ id, data: formData });
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

  if (isLoading) {
    return (
      <PageLayout>
        <PageHeader title="Cargando..." />
        <PageContent>
          <div className="text-center py-8">Cargando plantilla...</div>
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !template) {
    return (
      <PageLayout>
        <PageHeader title="Error" />
        <PageContent>
          <div className="text-center py-8 text-red-600">
            Error al cargar la plantilla. Inténtalo de nuevo.
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={`Editar Plantilla: ${template.title}`}
        description="Modifica la plantilla de encuesta existente"
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
            isLoading={updateTemplate.isPending}
            submitText="Guardar Cambios"
          />
        </form>
      </PageContent>
    </PageLayout>
  );
}
