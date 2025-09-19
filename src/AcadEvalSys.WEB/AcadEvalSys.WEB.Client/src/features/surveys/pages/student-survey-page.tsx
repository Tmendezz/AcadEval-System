import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
import { StudentSurveyRunner } from '../components/runner/StudentSurveyRunner';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/infrastructure/query/axios';
import { useParams } from 'wouter';

export default function StudentSurveyPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const surveyId = params?.id || '';
  const { data, isLoading } = useQuery({
    queryKey: ['student-survey-init', surveyId],
    queryFn: async () => {
      const { data } = await api.get(`/surveys/${surveyId}`);
      return data;
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!surveyId,
  });

  // Transformar las preguntas para convertir PascalCase a camelCase
  const transformedQuestions = data?.questions?.map((q: any) => ({
    ...q,
    allowComment: q.AllowComment || false
  })) || [];

  return (
    <PageLayout>
      <PageContent>
        {isLoading || !data ? (
          <div className="text-sm text-muted-foreground">Preparando tu encuesta...</div>
        ) : (
          <StudentSurveyRunner
            assignments={data.subjects}
            fixedQuestions={transformedQuestions}
            onSubmitAll={async () => setLocation('/encuestas')}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}


