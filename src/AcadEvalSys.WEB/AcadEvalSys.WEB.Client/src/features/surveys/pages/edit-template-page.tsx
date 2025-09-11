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

  if (isLoading || !template) {
    return (
      <PageLayout>
        <PageContent>
          <div className="text-sm text-muted-foreground">Cargando plantilla...</div>
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
          onCancel={() => setLocation('/templates')}
          isSubmitting={updateMutation.isPending}
        />
      </PageContent>
    </PageLayout>
  );
}

