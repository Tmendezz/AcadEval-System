import { useMemo, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useSurveySubjectsForUser, useSurveyForResponse } from '../hooks/use-surveys';
import { StudentSurveyRunner } from '../components/runner/StudentSurveyRunner';
import { useSurveyResponseStore } from '../store/use-survey-response-store';
import type { StudentSurveyTarget, FixedQuestion } from '../models/survey-runner-types';

export default function RespondSurveyPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/responder/:surveySubjectId');
  const surveySubjectId = params?.surveySubjectId;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store para manejar respuestas en memoria
  const {
    initializeSurvey,
    setCurrentSubject,
    getOverallProgress,
    clearSurvey,
    exportResponses,
    surveyId: storedSurveyId,
    currentSubjectId,
  } = useSurveyResponseStore();

  // Obtener la encuesta actual para extraer el surveyId
  const { data: currentSurvey, isLoading: isLoadingCurrentSurvey, error: currentSurveyError } = useSurveyForResponse(surveySubjectId || '');
  
  // Una vez que tenemos la encuesta actual, obtener todos los survey subjects de esa encuesta
  const surveyId = currentSurvey?.id;
  const { data: allSurveySubjects = [], isLoading: isLoadingSurveySubjects } = useSurveySubjectsForUser(surveyId || '');

  // Inicializar el store cuando tenemos todos los datos
  useEffect(() => {
    if (currentSurvey && allSurveySubjects.length > 0) {
      // Si es una nueva encuesta o cambió la encuesta, reinicializar
      if (storedSurveyId !== currentSurvey.id) {
        initializeSurvey(
          currentSurvey.id,
          currentSurvey.title,
          allSurveySubjects.map(subject => ({
            surveySubjectId: subject.surveySubjectId,
            subjectName: subject.subjectName,
            professorName: subject.professorName,
          }))
        );
      }
    }
  }, [currentSurvey?.id, allSurveySubjects.length, storedSurveyId, initializeSurvey]); // Solo cambios de encuesta
  
  // Actualizar materia actual basada en la URL (efecto separado)
  useEffect(() => {
    if (surveySubjectId && currentSubjectId !== surveySubjectId) {
      setCurrentSubject(surveySubjectId);
    }
  }, [surveySubjectId, currentSubjectId, setCurrentSubject]); // Solo cambios de URL

  // Convertir survey subjects a formato StudentSurveyTarget
  const surveyTargets: StudentSurveyTarget[] = useMemo(() => {
    return allSurveySubjects.map(subject => ({
      subjectId: subject.surveySubjectId,
      subjectName: subject.subjectName,
      teacherId: 'teacher-' + subject.surveySubjectId, // ID único por asignatura
      teacherName: subject.professorName,
      // Propiedades adicionales que necesita el runner
      academicSurveySubjectId: subject.surveySubjectId,
      id: subject.surveySubjectId
    } as any));
  }, [allSurveySubjects]);

  // Convertir preguntas de la encuesta actual a formato FixedQuestion
  const fixedQuestions: FixedQuestion[] = useMemo(() => {
    if (!currentSurvey?.questions) return [];
    
    return currentSurvey.questions.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type === 0 ? 'single' : q.type === 1 ? 'multi' : 'text',
      options: q.options?.map(opt => ({
        value: opt.value,
        text: opt.text
      }))
    } as FixedQuestion));
  }, [currentSurvey?.questions]);

  // Handler para mostrar confirmación cuando se completan todas las encuestas
  const handleSubmitAll = async () => {
    setShowConfirmDialog(true);
  };

  // Handler para enviar realmente las respuestas
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Obtener todas las respuestas del store
      const allResponses = exportResponses();
      
      // Enviar cada materia al servidor
      const submissions = Object.entries(allResponses).map(async ([subjectId, data]) => {
        
        // Convertir formato del store al formato esperado por la API
        const payload = data.responses.map((response: any) => {
          const answer = response.answer;
          
          if (Array.isArray(answer)) {
            // Respuesta múltiple - enviar como texto separado por comas
            return {
              QuestionId: response.questionId,
              Text: answer.join(', ')
            };
          } else if (typeof answer === 'string' && isNaN(Number(answer))) {
            // Respuesta de texto (no numérica)
            return {
              QuestionId: response.questionId,
              Text: answer
            };
          } else {
            // Respuesta simple con valor numérico
            return {
              QuestionId: response.questionId,
              SelectedValue: parseInt(answer)
            };
          }
        });

        const requestBody = { Answers: payload };

        // Enviar usando el endpoint correcto
        const response = await fetch(`/api/my-surveys/subjects/${subjectId}/responses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Error al enviar respuestas de ${data.subjectName}: ${response.status} ${response.statusText}`);
        }

        return { subjectId, subjectName: data.subjectName };
      });

      // Esperar a que se envíen todas las respuestas
      const results = await Promise.all(submissions);
      
      console.log('Todas las respuestas enviadas exitosamente:', results);
      
      // Limpiar el store después de enviar exitosamente
      clearSurvey();
      
      // Cerrar el modal
      setShowConfirmDialog(false);
      
      // Redirigir a la lista de encuestas
      setLocation('/encuestas/mis-encuestas?completed=true');
      
    } catch (error) {
      console.error('Error al enviar todas las encuestas:', error);
      // No limpiar el store para que el usuario pueda intentar de nuevo
      alert('Error al enviar las respuestas. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading mientras cargamos datos
  if (isLoadingCurrentSurvey || isLoadingSurveySubjects) {
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

  // Mostrar error si no se puede cargar la encuesta
  if (currentSurveyError || !currentSurvey || allSurveySubjects.length === 0) {
    return (
      <PageLayout>
        <PageHeader title="Error" description="No se pudo cargar la encuesta">
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
          <Alert variant="destructive">
            <AlertDescription>
              No se pudo cargar la encuesta o no hay materias asignadas. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        </PageContent>
      </PageLayout>
    );
  }

  // Encontrar el índice actual basado en el surveySubjectId de la URL
  const currentIndex = surveyTargets.findIndex(target => target.subjectId === surveySubjectId);
  const initialIndex = currentIndex >= 0 ? currentIndex : 0;
  
  // Contador simple de progreso
  const simpleProgress = `${initialIndex + 1}/${allSurveySubjects.length}`;

  return (
    <PageLayout>
      <PageHeader 
        title={currentSurvey.title} 
        description={simpleProgress}
      >
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
        <div className="max-w-4xl mx-auto">
          <StudentSurveyRunner
            assignments={surveyTargets}
            fixedQuestions={fixedQuestions}
            onSubmitAll={handleSubmitAll}
            initialIndex={initialIndex}
          />
        </div>
      </PageContent>

      {/* Modal de confirmación para enviar todas las respuestas */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              ¿Enviar todas las respuestas?
            </DialogTitle>
            <DialogDescription>
              Has completado {getOverallProgress().completed} de {getOverallProgress().total} evaluaciones. 
              <br />
              <strong>¿Deseas enviar todas las respuestas ahora?</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                'Enviar Respuestas'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}