import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { useSurveyForResponse, useSubmitSurveyResponse } from '../hooks/use-user-surveys';

// Tipos para las preguntas de la encuesta
interface SurveyQuestion {
  id: string;
  text: string;
  type: 'single' | 'multi' | 'text';
  options?: string[];
  required: boolean;
}

interface SurveyResponse {
  questionId: string;
  answer: string | string[];
}


export default function RespondSurveyPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/responder/:id');
  const surveyId = params?.id;

  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  // Obtener datos de la encuesta
  const { data: survey, isLoading, error } = useSurveyForResponse(surveyId || '');
  const submitResponseMutation = useSubmitSurveyResponse();

  // Función para manejar cambios en las respuestas
  const handleResponseChange = (questionId: string, answer: string | string[]) => {
    setResponses(prev => {
      const existingIndex = prev.findIndex(r => r.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId, answer };
        return updated;
      }
      return [...prev, { questionId, answer }];
    });
  };

  // Función para verificar si todas las preguntas requeridas están respondidas
  const isFormValid = () => {
    if (!survey?.questions) return false;
    const requiredQuestions = survey.questions.filter(q => q.required);
    return requiredQuestions.every(q => 
      responses.some(r => r.questionId === q.id && r.answer)
    );
  };

  // Función para enviar la encuesta
  const handleSubmit = async () => {
    if (!isFormValid() || !surveyId) {
      return;
    }

    try {
      await submitResponseMutation.mutateAsync({
        surveyId,
        responses: responses.map(r => ({
          questionId: r.questionId,
          answer: r.answer
        }))
      });
      
      setLocation('/encuestas/mis-encuestas?completed=true');
    } catch (error) {
      console.error('Error al enviar la encuesta:', error);
    }
  };

  // Función para renderizar una pregunta
  const renderQuestion = (question: SurveyQuestion) => {
    const currentResponse = responses.find(r => r.questionId === question.id);

    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={currentResponse?.answer === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multi':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(currentResponse?.answer) && currentResponse.answer.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(currentResponse?.answer) ? currentResponse.answer : [];
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    handleResponseChange(question.id, newAnswers);
                  }}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={currentResponse?.answer as string || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
          />
        );

      default:
        return null;
    }
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando encuesta...</p>
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  // Mostrar error
  if (error || !survey) {
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
              <h1 className="text-2xl font-bold">Error</h1>
              <p className="text-muted-foreground">No se pudo cargar la encuesta</p>
            </div>
          </div>
        </PageHeader>
        <PageContent>
          <Alert variant="destructive">
            <AlertDescription>
              No se pudo cargar la encuesta. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        </PageContent>
      </PageLayout>
    );
  }

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
            <h1 className="text-2xl font-bold">{survey.title}</h1>
            <p className="text-muted-foreground">{survey.description}</p>
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
                <Badge variant="default">Publicada</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Publicada: {new Date(survey.publishedAt).toLocaleDateString('es-ES')}</span>
              </div>
              {survey.closedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Cierra: {new Date(survey.closedAt).toLocaleDateString('es-ES')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulario de la encuesta */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas de la Encuesta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {survey.questions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      {index + 1}. {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    {question.type === 'text' && (
                      <p className="text-sm text-muted-foreground">
                        Esta pregunta es opcional
                      </p>
                    )}
                  </div>
                  
                  {renderQuestion(question)}
                  
                  {/* Indicador de respuesta */}
                  {responses.find(r => r.questionId === question.id) && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Respondida</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Validación y envío */}
          {!isFormValid() && (
            <Alert>
              <AlertDescription>
                Por favor, responde todas las preguntas obligatorias antes de enviar la encuesta.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/encuestas/mis-encuestas')}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid() || submitResponseMutation.isPending}
            >
              {submitResponseMutation.isPending ? 'Enviando...' : 'Enviar Encuesta'}
            </Button>
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}