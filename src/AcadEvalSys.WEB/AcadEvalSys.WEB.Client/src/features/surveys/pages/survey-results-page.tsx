import { useRoute, useLocation } from 'wouter';
import { useMemo } from 'react';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { toast } from 'sonner';
import {
  ArrowLeft,
  BarChart3,
  Download,
  Users,
  TrendingUp,
  MessageSquare,
  PieChart
} from 'lucide-react';
import { useSurvey, useSurveyResponses } from '../hooks/use-surveys';
import { PageLoader } from '@/shared/components/ui/page-loader';

export default function SurveyResultsPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/resultados/:surveyId');
  const surveyId = params?.surveyId;

  const { data: survey, isLoading: surveyLoading, error: surveyError } = useSurvey(surveyId || '');
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useSurveyResponses(surveyId || '');

  // Calcular estadísticas agregadas de las analytics
  const aggregatedStats = useMemo(() => {
    if (!analytics || !analytics.careerAnalytics || !Array.isArray(analytics.careerAnalytics)) {
      return {
        totalSubjects: 0,
        totalStudents: 0,
        totalProfessors: 0,
        averageResponseRate: 0
      };
    }

    let totalSubjects = 0;
    let totalStudents = 0;
    let totalProfessors = 0;
    let totalResponseRates = 0;
    let yearCount = 0;

    analytics.careerAnalytics.forEach(career => {
      if (career.careerYear && Array.isArray(career.careerYear)) {
        career.careerYear.forEach(year => {
          totalSubjects += year.subjectsCount || 0;
          totalStudents += year.studentsCount || 0;
          totalProfessors += year.professorsCount || 0;
          totalResponseRates += year.responseRate || 0;
          yearCount++;
        });
      }
    });

    return {
      totalSubjects,
      totalStudents,
      totalProfessors,
      averageResponseRate: yearCount > 0 ? totalResponseRates / yearCount : 0
    };
  }, [analytics]);

  const isLoading = surveyLoading || analyticsLoading;
  const error = surveyError || analyticsError;

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <PageLoader />
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !survey || !analytics) {
    return (
      <PageLayout>
        <PageContent>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive">Error al cargar los resultados</h2>
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

  const handleExportPDF = () => {
    // TODO: Implementar exportación a PDF
    toast.info("Funcionalidad de exportación a PDF próximamente disponible");
  };

  const handleExportExcel = () => {
    // TODO: Implementar exportación a Excel
    toast.info("Funcionalidad de exportación a Excel próximamente disponible");
  };

  return (
    <PageLayout>
      <PageHeader
        title={`Resultados: ${survey.title}`}
        description={`Análisis detallado de las ${analytics?.totalResponses ?? 0} respuestas recibidas`}
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
          <Button onClick={handleExportPDF} size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
          <Button onClick={handleExportExcel} size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Excel
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <div className="space-y-6">
          {/* Resumen General */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Respuestas</p>
                  <p className="text-2xl font-bold">{analytics?.totalResponses ?? 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Materias</p>
                  <p className="text-2xl font-bold">{aggregatedStats.totalSubjects}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Preguntas</p>
                  <p className="text-2xl font-bold">{analytics?.totalQuestions ?? 0}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasa de Respuesta</p>
                  <p className="text-2xl font-bold">
                    {(analytics?.responseRate ?? 0).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </CardContent>
            </Card>
          </div>

          {/* Análisis Detallado */}
          <Tabs defaultValue="careers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="careers" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Por Carrera
              </TabsTrigger>
            </TabsList>

            <TabsContent value="careers" className="space-y-4">
              {analytics?.careerAnalytics && analytics.careerAnalytics.length > 0 ? (
                analytics.careerAnalytics.map((career) => (
                  <Card key={career.technicalCareerId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{career.careerName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {career.careerYear && career.careerYear.length > 0 ? (
                        career.careerYear.map((year) => (
                          <div key={year.year} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{year.yearName}</h4>
                              <Badge variant="default">{year.responseRate.toFixed(1)}% de respuesta</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Materias</p>
                                <p className="text-lg font-bold">{year.subjectsCount}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Estudiantes</p>
                                <p className="text-lg font-bold">{year.studentsCount}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Profesores</p>
                                <p className="text-lg font-bold">{year.professorsCount}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Respuestas</p>
                                <p className="text-lg font-bold">{year.responsesCount}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No hay datos disponibles para esta carrera</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No hay datos de analytics disponibles</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageContent>
    </PageLayout>
  );
}
