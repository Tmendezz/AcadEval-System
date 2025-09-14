import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
import { useLocation } from 'wouter';
import { TemplateWizard } from '../components/wizard/template-wizard';
import { useCreateSurveyTemplate } from '../hooks/use-survey-templates';

export default function CreateTemplatePage() {
  const [, setLocation] = useLocation();
  const createMutation = useCreateSurveyTemplate();

  return (
    <PageLayout>
      <PageContent>
        <TemplateWizard
          onSubmit={async (payload) => {
            await createMutation.mutateAsync(payload);
            setLocation('/templates');
          }}
          isSubmitting={createMutation.isPending}
        />
      </PageContent>
    </PageLayout>
  );
}
