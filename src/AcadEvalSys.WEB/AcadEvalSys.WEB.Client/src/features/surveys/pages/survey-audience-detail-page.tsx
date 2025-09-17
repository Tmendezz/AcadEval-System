import { useLocation, useRoute } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useSurvey, useAudienceResponses } from '../hooks/use-surveys';

export default function SurveyAudienceDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/progreso/:surveyId/audiencia/:career/:year');
  const surveyId = params?.surveyId ?? '';
  const career = params?.career ? decodeURIComponent(params.career) : '';
  const year = params?.year ? Number(params.year) : undefined;

  const { data: survey, isLoading: loadingSurvey } = useSurvey(surveyId);
  const { data: audience, isLoading: loadingAudience, error } = useAudienceResponses(surveyId, career, year ?? 0);

  const isLoading = loadingSurvey || loadingAudience;

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando detalle de audiencia...</p>
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !survey) {
    return (
      <PageLayout>
        <PageContent>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive">Error al cargar</h2>
            <p className="text-muted-foreground mt-2">No se pudo cargar la audiencia.</p>
            <Button onClick={() => setLocation(`/encuestas/progreso/${surveyId}`)} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Audiencias
            </Button>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  const list = (audience?.subjects ?? []).map(s => ({
    surveySubjectId: s.surveySubjectId,
    subjectName: s.subjectName ?? 'Asignatura',
    professorName: s.professorName ?? '—'
  }));

  return (
    <PageLayout>
      <PageHeader title={`${career} — ${year}° Año`} description={survey.title}>
        <Button variant="ghost" size="sm" onClick={() => setLocation(`/encuestas/progreso/${surveyId}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Audiencias
        </Button>
      </PageHeader>
      <PageContent>
        <div className="space-y-4">
          {list.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay respuestas aún para esta audiencia.
              </CardContent>
            </Card>
          )}
          {list.map((s) => (
            <Card key={s.surveySubjectId}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {s.subjectName} — {s.professorName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(audience?.subjects.find(x => x.surveySubjectId === s.surveySubjectId)?.questions ?? []).map(q => (
                    <div key={q.questionId}>
                      <div className="text-sm font-medium">{q.text}</div>
                      <div className="text-xs text-muted-foreground mb-1">Respuestas: {q.totalResponses}</div>
                      {Object.entries(q.percentage).map(([val, pct]) => (
                        <div key={val} className="flex items-center gap-2 text-xs">
                          <div className="w-6">{val}</div>
                          <div className="flex-1 h-1.5 bg-muted rounded">
                            <div className="h-1.5 bg-primary rounded" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="w-10 text-right">{pct.toFixed(0)}%</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContent>
    </PageLayout>
  );
}
