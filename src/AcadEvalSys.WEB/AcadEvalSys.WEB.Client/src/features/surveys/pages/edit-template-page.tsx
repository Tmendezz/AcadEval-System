import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
import { useLocation, useParams } from 'wouter';
import { TemplateWizard } from '../components/wizard/template-wizard';
import { useSurveyTemplate, useUpdateSurveyTemplate } from '../hooks/use-survey-templates';

export default function EditTemplatePage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const { data: template, isLoading } = useSurveyTemplate(id);
  const updateMutation = useUpdateSurveyTemplate();

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="text-sm text-muted-foreground">Cargando plantilla...</div>
        </PageContent>
      </PageLayout>
    );
  }

  if (!template) {
    return (
      <PageLayout>
        <PageContent>
          <div className="text-sm text-red-600">No se pudo cargar la plantilla con ID: {id}</div>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <TemplateWizard
          onSubmit={async (payload) => {
            await updateMutation.mutateAsync({ id, data: payload });
            setLocation('/templates');
          }}
          isSubmitting={updateMutation.isPending}
          initialData={{
            title: template.title,
            description: template.description,
            surveyType: template.surveyType,
            isDraft: template.isDraft,
            questions: template.questions,
          }}
        />
      </PageContent>
    </PageLayout>
  );
}

