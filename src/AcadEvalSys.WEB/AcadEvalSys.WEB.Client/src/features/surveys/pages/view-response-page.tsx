import { useLocation, useRoute } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
import { useSurveyForResponse } from '../hooks/use-surveys';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export default function ViewResponsePage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/ver-respuesta/:surveyId');
  const surveyId = params?.surveyId;

  // Obtener la encuesta con las respuestas en modo solo lectura
  const { data: survey, isLoading, error } = useSurveyForResponse(surveyId || '', true);

  // Función para renderizar una respuesta según su tipo
  const renderResponse = (question: any) => {
    if (!question.response) {
      return (
        <div className="p-3 bg-muted/50 rounded-md">
          <span className="text-muted-foreground">Sin respuesta</span>
        </div>
      );
    }

    const response = question.response;

    // Respuesta de texto
    if (response.text) {
      return (
        <div className="p-3 bg-muted/50 rounded-md min-h-[80px]">
          <p className="whitespace-pre-wrap">{response.text}</p>
        </div>
      );
    }

    // Respuesta múltiple (array de valores)
    if (response.values && Array.isArray(response.values)) {
      return (
        <div className="space-y-2">
          {response.values.map((value: any, index: number) => (
            <div key={index} className="p-2 bg-muted/50 rounded-md">
              <span>{value}</span>
            </div>
          ))}
        </div>
      );
    }

    // Respuesta simple (valor único)
    if (response.value !== undefined) {
      // Buscar el texto de la opción seleccionada
      const selectedOption = question.options?.find((opt: any) => opt.value === response.value);
      const displayText = selectedOption ? selectedOption.text : response.value.toString();
      
      return (
        <div className="p-3 bg-muted/50 rounded-md">
          <span className="font-medium">{displayText}</span>
        </div>
      );
    }

    return (
      <div className="p-3 bg-muted/50 rounded-md">
        <span className="text-muted-foreground">Respuesta no válida</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando respuestas...</p>
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !survey) {
    return (
      <PageLayout>
        <PageHeader title="Error" description="No se pudieron cargar las respuestas">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/encuestas/mis-encuestas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </PageHeader>
        <PageContent>
          <Alert variant="destructive">
            <AlertDescription>
              No se pudieron cargar las respuestas de la encuesta. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader title={survey.title} description="Vista de solo lectura de tus respuestas">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/encuestas/mis-encuestas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Información de la encuesta */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Encuesta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Publicada:</span>
                  <span>{survey.publishedAt ? new Date(survey.publishedAt).toLocaleDateString() : 'No disponible'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Respondida:</span>
                  <span>{survey.respondedAt ? new Date(survey.respondedAt).toLocaleDateString() : 'No respondida'}</span>
                </div>
              </div>
              {survey.description && (
                <p className="text-sm text-muted-foreground">{survey.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Respuestas */}
          <Card>
            <CardHeader>
              <CardTitle>Tus Respuestas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {survey.questions?.map((question: any, index: number) => (
                <div key={question.id} className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">
                      {index + 1}. {question.text}
                    </h3>
                  </div>
                  
                  {renderResponse(question)}
                </div>
              ))}
              
              {(!survey.questions || survey.questions.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay preguntas disponibles en esta encuesta.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Eye className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Esta es una vista de solo lectura de tu respuesta. 
                  No puedes modificar las respuestas una vez enviadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageLayout>
  );
}