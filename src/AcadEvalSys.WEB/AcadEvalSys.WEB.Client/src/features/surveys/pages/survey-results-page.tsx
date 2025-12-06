import { useRoute, useLocation } from 'wouter';
import { useState, useMemo } from 'react';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Progress } from '@/shared/components/ui/progress';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  BarChart3, 
  Download, 
  FileText, 
  Users, 
  TrendingUp,
  MessageSquare,
  PieChart
} from 'lucide-react';
import { useSurvey, useSurveyResponses } from '../hooks/use-surveys';
import { PageLoader } from '@/shared/components/ui/page-loader';

interface QuestionStatistics {
  questionId: string;
  questionText: string;
  questionType: 'single' | 'multiple' | 'text';
  totalResponses: number;
  averageScore?: number;
  optionCounts?: Record<number, number>;
  textResponses?: string[];
}

interface FilterState {
  career: string;
  year: string;
  role: string;
}

export default function SurveyResultsPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/resultados/:surveyId');
  const surveyId = params?.surveyId;

  const [filters, setFilters] = useState<FilterState>({
    career: 'all',
    year: 'all',
    role: 'all'
  });

  const { data: survey, isLoading: surveyLoading, error: surveyError } = useSurvey(surveyId || '');
  const { data: responses, isLoading: responsesLoading, error: responsesError } = useSurveyResponses(surveyId || '');

  // Calcular estadísticas de las respuestas
  const statistics = useMemo(() => {
    if (!responses || !responses.responses.length) return [];

    // Agrupar respuestas por pregunta
    const questionStats: Record<string, QuestionStatistics> = {};

    responses.responses.forEach(response => {
      response.answers.forEach(answer => {
        if (!questionStats[answer.questionId]) {
          questionStats[answer.questionId] = {
            questionId: answer.questionId,
            questionText: `Pregunta ${answer.questionId}`, // Temporal, necesitaríamos los detalles de la pregunta
            questionType: answer.selectedValue !== undefined ? 'single' : 'text',
            totalResponses: 0,
            optionCounts: {},
            textResponses: []
          };
        }

        const stat = questionStats[answer.questionId];
        stat.totalResponses++;

        if (answer.selectedValue !== undefined) {
          // Respuesta de opción múltiple/escala
          stat.optionCounts![answer.selectedValue] = (stat.optionCounts![answer.selectedValue] || 0) + 1;
        } else if (answer.text) {
          // Respuesta de texto
          stat.textResponses!.push(answer.text);
        }
      });
    });

    // Calcular promedios para preguntas de escala
    Object.values(questionStats).forEach(stat => {
      if (stat.optionCounts && Object.keys(stat.optionCounts).length > 0) {
        const total = Object.entries(stat.optionCounts).reduce((sum, [value, count]) => {
          return sum + (Number(value) * count);
        }, 0);
        stat.averageScore = total / stat.totalResponses;
      }
    });

    return Object.values(questionStats);
  }, [responses]);

  const isLoading = surveyLoading || responsesLoading;
  const error = surveyError || responsesError;

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <PageLoader />
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !survey || !responses) {
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
        description={`Análisis detallado de las ${responses.totalResponses} respuestas recibidas`}
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
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Filtros de Análisis
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tecnicatura</label>
                <Select
                  value={filters.career}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, career: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tecnicatura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las tecnicaturas</SelectItem>
                    <SelectItem value="sistemas">Sistemas</SelectItem>
                    <SelectItem value="electronica">Electrónica</SelectItem>
                    <SelectItem value="mecanica">Mecánica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Año de Cursado</label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los años</SelectItem>
                    <SelectItem value="1">Primer año</SelectItem>
                    <SelectItem value="2">Segundo año</SelectItem>
                    <SelectItem value="3">Tercer año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Rol</label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="student">Estudiantes</SelectItem>
                    <SelectItem value="professor">Profesores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resumen General */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Respuestas</p>
                  <p className="text-2xl font-bold">{responses.totalResponses}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Materias</p>
                  <p className="text-2xl font-bold">{responses.subjectsCount}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Preguntas</p>
                  <p className="text-2xl font-bold">{statistics.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Promedio General</p>
                  <p className="text-2xl font-bold">
                    {statistics.length > 0 
                      ? (statistics.reduce((sum, stat) => sum + (stat.averageScore || 0), 0) / statistics.filter(s => s.averageScore).length).toFixed(1)
                      : '0'
                    }
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </CardContent>
            </Card>
          </div>

          {/* Análisis Detallado */}
          <Tabs defaultValue="statistics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Estadísticas
              </TabsTrigger>
              <TabsTrigger value="responses" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Respuestas Abiertas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statistics" className="space-y-4">
              {statistics.filter(stat => stat.averageScore !== undefined).map((stat) => (
                <Card key={stat.questionId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{stat.questionText}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{stat.totalResponses} respuestas</Badge>
                      <Badge variant="default">Promedio: {stat.averageScore!.toFixed(2)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {Object.entries(stat.optionCounts || {}).map(([value, count]) => {
                        const percentage = (count / stat.totalResponses) * 100;
                        return (
                          <div key={value} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Opción {value}</span>
                              <span>{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="responses" className="space-y-4">
              {statistics.filter(stat => stat.textResponses && stat.textResponses.length > 0).map((stat) => (
                <Card key={stat.questionId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{stat.questionText}</CardTitle>
                    <Badge variant="outline">{stat.textResponses!.length} respuestas de texto</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {stat.textResponses!.map((response, index) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          <p className="text-sm">{response}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </PageContent>
    </PageLayout>
  );
}
