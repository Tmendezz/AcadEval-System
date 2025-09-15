import { useLocation, useRoute } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, Eye } from 'lucide-react';

// Tipos para las respuestas
interface SurveyResponse {
  questionId: string;
  questionText: string;
  answer: string | string[];
  questionType: 'single' | 'multi' | 'text';
}

// Datos de ejemplo (TODO: reemplazar con API real)
const mockSurveyResponse = {
  id: '1',
  title: 'Evaluación de Docentes - Primer Cuatrimestre',
  description: 'Encuesta para evaluar el desempeño de los docentes del primer cuatrimestre',
  publishedAt: '2024-01-15T10:00:00Z',
  respondedAt: '2024-01-22T14:30:00Z',
  responses: [
    {
      questionId: '1',
      questionText: '¿Cómo calificarías la claridad en las explicaciones del docente?',
      answer: 'Muy bueno',
      questionType: 'single' as const
    },
    {
      questionId: '2',
      questionText: '¿Qué aspectos del curso te gustaron más? (Puedes seleccionar varios)',
      answer: ['Metodología de enseñanza', 'Material didáctico', 'Interacción en clase'],
      questionType: 'multi' as const
    },
    {
      questionId: '3',
      questionText: '¿Tienes alguna sugerencia para mejorar el curso?',
      answer: 'Me gustaría que hubiera más ejercicios prácticos y menos teoría.',
      questionType: 'text' as const
    }
  ]
};

export default function ViewResponsePage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/ver-respuesta/:id');
  const responseId = params?.id;

  // Función para renderizar una respuesta
  const renderResponse = (response: SurveyResponse) => {
    switch (response.questionType) {
      case 'single':
        return (
          <div className="p-3 bg-muted/50 rounded-md">
            <span className="font-medium">{response.answer}</span>
          </div>
        );

      case 'multi':
        return (
          <div className="space-y-2">
            {Array.isArray(response.answer) ? (
              response.answer.map((option, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{option}</span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-muted/50 rounded-md">
                <span className="font-medium">{response.answer}</span>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="p-3 bg-muted/50 rounded-md min-h-[80px]">
            <p className="whitespace-pre-wrap">{response.answer}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <PageHeader>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/encuestas/mis-encuestas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mockSurveyResponse.title}</h1>
            <p className="text-muted-foreground">{mockSurveyResponse.description}</p>
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Información de la encuesta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Información de la Encuesta</span>
                <Badge variant="default" className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Solo Lectura
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Publicada: {new Date(mockSurveyResponse.publishedAt).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Respondida: {new Date(mockSurveyResponse.respondedAt).toLocaleDateString('es-ES')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Respuestas */}
          <Card>
            <CardHeader>
              <CardTitle>Tus Respuestas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockSurveyResponse.responses.map((response, index) => (
                <div key={response.questionId} className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">
                      {index + 1}. {response.questionText}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Respondida</span>
                    </div>
                  </div>
                  
                  {renderResponse(response)}
                </div>
              ))}
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