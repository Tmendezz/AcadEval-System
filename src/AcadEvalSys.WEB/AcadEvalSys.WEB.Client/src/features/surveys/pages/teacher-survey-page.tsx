import { PageContent, PageLayout } from '@/shared/components/layout/page-layout';
import { TeacherSurveyRunner } from '../components/runner/TeacherSurveyRunner';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/infrastructure/query/axios';
import { useParams } from 'wouter';

export default function TeacherSurveyPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const surveyId = params?.id || '';
  const { data, isLoading } = useQuery({
    queryKey: ['teacher-survey-init', surveyId],
    queryFn: async () => {
      const { data } = await api.get(`/surveys/${surveyId}`);
      return data;
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!surveyId,
  });

  return (
    <PageLayout>
      <PageContent>
        {isLoading || !data ? (
          <div className="text-sm text-muted-foreground">Preparando encuesta...</div>
        ) : (
          <TeacherSurveyRunner
            assignments={data.subjects}
            fixedQuestions={data.questions}
            onSubmitAll={async () => setLocation('/encuestas')}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}


