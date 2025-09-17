import { useRoute, useLocation } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { ArrowLeft, Users, CheckCircle, Clock, BarChart, FileText } from 'lucide-react';
import { useSurveyById } from '../hooks/use-surveys';

export default function SurveyProgressPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/progreso/:surveyId');
  const surveyId = params?.surveyId;

  const { data: survey, isLoading, error } = useSurveyById(surveyId || '');

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando progreso de la encuesta...</p>
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !survey) {
    return (
      <PageLayout>
        <PageHeader title="Error" description="No se pudo cargar el progreso de la encuesta">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/encuestas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </PageHeader>
        <PageContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se pudo cargar la información de la encuesta.</p>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  // Datos simulados para el progreso (TODO: conectar con API real)
  const progressData = {
    totalParticipants: 150,
    completedResponses: 89,
    partialResponses: 23,
    pendingResponses: 38,
    completionRate: 59.3,
    averageTimeToComplete: '12 min',
    responsesBySubject: [
      { subjectName: 'Matemática', professorName: 'Prof. García', responses: 45, total: 50 },
      { subjectName: 'Física', professorName: 'Prof. López', responses: 38, total: 45 },
      { subjectName: 'Química', professorName: 'Prof. Martínez', responses: 42, total: 55 },
    ]
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <Badge variant="secondary">Borrador</Badge>;
      case 1: return <Badge variant="outline">Programada</Badge>;
      case 2: return <Badge variant="default">Publicada</Badge>;
      case 3: return <Badge variant="destructive">Cerrada</Badge>;
      default: return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const isCompleted = survey.status === 3; // Closed = completed

  return (
    <PageLayout>
      <PageHeader 
        title={survey.title} 
        description={isCompleted ? "Resultados de la encuesta" : "Progreso de la encuesta en tiempo real"}
      >
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/encuestas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          {isCompleted && (
            <Button size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              Exportar Resultados
            </Button>
          )}
        </div>
      </PageHeader>

      <PageContent>
        <div className="space-y-6">
          {/* Información general de la encuesta */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  {getStatusBadge(survey.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preguntas</p>
                  <p className="font-medium">{survey.questionsCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publicada</p>
                  <p className="font-medium">
                    {survey.publishedAt ? new Date(survey.publishedAt).toLocaleDateString('es-ES') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo promedio</p>
                  <p className="font-medium">{progressData.averageTimeToComplete}</p>
                </div>
              </div>
              
              {survey.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="text-sm">{survey.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas de progreso */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{progressData.totalParticipants}</p>
                    <p className="text-sm text-muted-foreground">Total Participantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{progressData.completedResponses}</p>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-2xl font-bold">{progressData.partialResponses}</p>
                    <p className="text-sm text-muted-foreground">En Progreso</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{progressData.completionRate}%</p>
                    <p className="text-sm text-muted-foreground">Tasa de Finalización</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progreso general */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progreso de respuestas</span>
                  <span className="text-sm text-muted-foreground">
                    {progressData.completedResponses} de {progressData.totalParticipants} participantes
                  </span>
                </div>
                <Progress value={progressData.completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Progreso por materia */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso por Materia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.responsesBySubject.map((subject, index) => {
                  const completionRate = (subject.responses / subject.total) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{subject.subjectName}</p>
                          <p className="text-sm text-muted-foreground">{subject.professorName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{subject.responses}/{subject.total}</p>
                          <p className="text-sm text-muted-foreground">{completionRate.toFixed(1)}%</p>
                        </div>
                      </div>
                      <Progress value={completionRate} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Acciones adicionales */}
          {isCompleted && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados y Reportes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start gap-2">
                    <BarChart className="w-4 h-4" />
                    Ver Análisis Detallado
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    Exportar a Excel
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    Generar Reporte PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContent>
    </PageLayout>
  );
}
