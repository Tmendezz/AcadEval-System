import { useRoute, useLocation } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import { useSurvey, useTechnicalCareers, useAudienceResponses } from '../hooks/use-surveys';
import { useEffect, useMemo, useState } from 'react';
import { surveyService } from '../services/survey-service';
import { PageLoader } from '@/shared/components/ui/page-loader';
// import { SurveyStatus } from '../models/survey-types';

export default function SurveyProgressPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/progreso/:surveyId');
  const surveyId = params?.surveyId;

  const { data: survey, isLoading, error } = useSurvey(surveyId || '');
  const { data: careers = [] } = useTechnicalCareers();

  // Mapa de opciones: questionId -> (value -> text)
  const optionTextByQuestion = useMemo(() => {
    const map: Record<string, Record<number, string>> = {};
    const questions: Array<{ id: string; options?: Array<{ value: number; text: string }> }> =
      (survey as any)?.questions ?? [];
    for (const q of questions) {
      if (!q?.options) continue;
      map[q.id] = {} as Record<number, string>;
      for (const opt of q.options) {
        map[q.id][opt.value] = opt.text;
      }
    }
    return map;
  }, [survey]);

  // Mapear años de CareerYear enum a números
  const yearMapping: Record<string, number> = {
    'First': 1,
    'Second': 2,
    'Third': 3
  };

  // Obtener años disponibles por carrera desde la audiencia de la encuesta
  const availableYearsByCareer = useMemo(() => {
    if (!survey || !careers.length) return {};
    
    const result: Record<string, number[]> = {};
    const surveyAudience = (survey as any)?.audience || [];
    
    for (const audienceItem of surveyAudience) {
      const career = careers.find(c => c.id === audienceItem.technicalCareerId);
      if (!career) continue;
      
      const years = audienceItem.selectedYears?.map((year: string) => yearMapping[year]).filter(Boolean) || [];
      if (years.length > 0) {
        result[career.name] = years.sort((a: number, b: number) => a - b);
      }
    }
    
    return result;
  }, [survey, careers]);

  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: audience, isLoading: loadingAudience } = useAudienceResponses(
    surveyId || '',
    selectedCareerId || '',
    selectedYear || 0
  );

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <PageLoader />
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !survey) {
    return (
      <PageLayout>
        <PageContent>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive">Error al cargar la encuesta</h2>
            <p className="text-muted-foreground mt-2">No se pudo encontrar la encuesta o hubo un error.</p>
            <Button onClick={() => setLocation('/encuestas')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Encuestas
            </Button>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  // const isPublished = survey.status === SurveyStatus.Published;
  // const isClosed = survey.status === SurveyStatus.Closed;

  return (
    <PageLayout>
      <PageHeader
        title={`Encuesta ${survey.title} - tecnicatura`}
        description={survey.description}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/encuestas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Encuestas
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <div className="space-y-4">
          {/* Mostrar tecnicaturas y solo años con datos (vía endpoint aggregated) */}
          {careers.map(career => {
            const years = (availableYearsByCareer[career.name] || []).sort((a, b) => a - b);
            if (years.length === 0) return null;
            return (
              <Card key={career.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    {career.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {years.map((year) => (
                      <Button
                        key={year}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCareerId(career.id);
                          setSelectedYear(year);
                        }}
                      >
                        {year === 1 ? '1er Año' : year === 2 ? '2do Año' : '3er Año'}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Detalle de audiencia en la misma página */}
          {selectedCareerId && selectedYear && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Resultados — {selectedYear}° Año
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCareerId(null);
                      setSelectedYear(null);
                    }}
                    className="ml-auto"
                  >
                    ✕ Cerrar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAudience && (
                  <div className="py-8 text-center text-muted-foreground">Cargando resultados...</div>
                )}
                {!loadingAudience && (!audience || (audience.subjects ?? []).length === 0) && (
                  <div className="py-8 text-center text-muted-foreground">No hay respuestas aún para esta audiencia.</div>
                )}
                {!loadingAudience && audience && (
                  <div className="space-y-4">
                    {audience.subjects.map(s => (
                      <Card key={s.surveySubjectId}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            {(s.subjectName ?? 'Asignatura')} — {(s.professorName ?? '—')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {s.questions.map(q => (
                              <div key={q.questionId}>
                                <div className="text-sm font-medium">{q.text}</div>
                                <div className="text-xs text-muted-foreground mb-1">Respuestas: {q.totalResponses}</div>
                                {(() => {
                                  const allOptions = optionTextByQuestion[q.questionId] ?? {};
                                  const allValues = Object.keys(allOptions).map(Number).sort((a, b) => a - b);
                                  return allValues.map(value => {
                                    const label = allOptions[value] ?? value.toString();
                                    const pct = q.percentage[value] ?? 0;
                                    return (
                                      <div key={value} className="flex items-center gap-2 text-xs">
                                        <div className="min-w-[2rem]">{label}</div>
                                        <div className="flex-1 h-1.5 bg-muted rounded">
                                          <div className="h-1.5 bg-primary rounded" style={{ width: `${pct}%` }} />
                                        </div>
                                        <div className="w-10 text-right">{pct.toFixed(0)}%</div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instrucciones cuando no hay selección */}
          {!selectedCareerId && !selectedYear && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-4" />
                <p>Haz clic en un año para ver los resultados detallados por profesor y curso.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContent>
    </PageLayout>
  );
}