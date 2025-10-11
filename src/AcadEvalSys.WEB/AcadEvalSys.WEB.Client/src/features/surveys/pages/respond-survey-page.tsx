import { useMemo, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useSurveyForResponse, useSubmitSurveyResponse, useSurveySubjectsForUser } from '../hooks/use-surveys';
import { StudentSurveyRunner } from '../components/runner/StudentSurveyRunner';
import { useSurveyResponseStore } from '../store/use-survey-response-store';
import type { StudentSurveyTarget, FixedQuestion } from '../models/survey-runner-types';
import { PageLoader } from '@/shared/components/ui/page-loader';

export default function RespondSurveyPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/encuestas/responder/:surveyId');
  const routeSurveyId = params?.surveyId;
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

  // Obtener la encuesta actual usando el surveyId de la ruta
  const { data: currentSurvey, isLoading: isLoadingCurrentSurvey, error: currentSurveyError } = useSurveyForResponse(routeSurveyId || '');
  const surveyId = currentSurvey?.id || routeSurveyId || '';
  const { data: allSurveySubjects = [], isLoading: isLoadingSurveySubjects } = useSurveySubjectsForUser(surveyId);

  // Inicializar el store cuando tenemos encuesta y subjects
  useEffect(() => {
    if (currentSurvey && allSurveySubjects.length > 0 && storedSurveyId !== currentSurvey.id) {
      initializeSurvey(
        currentSurvey.id,
        currentSurvey.title,
        allSurveySubjects.map(s => ({
          surveySubjectId: s.surveySubjectId,
          subjectName: s.subjectName,
          professorName: s.professorName,
        }))
      );
    }
  }, [currentSurvey?.id, currentSurvey?.title, allSurveySubjects.length, storedSurveyId, initializeSurvey]);
  
  // Seleccionar primer subject si no hay uno activo
  useEffect(() => {
    if (!currentSubjectId && allSurveySubjects.length > 0) {
      setCurrentSubject(allSurveySubjects[0].surveySubjectId);
    }
  }, [allSurveySubjects, currentSubjectId, setCurrentSubject]);

  // Convertir survey subjects a formato StudentSurveyTarget
  const surveyTargets: StudentSurveyTarget[] = useMemo(() => {
    return allSurveySubjects.map(s => ({
      subjectId: s.surveySubjectId,
      subjectName: s.subjectName,
      teacherId: (s.professorId ? `prof-${s.professorId}` : `prof-${s.surveySubjectId}`),
      teacherName: s.professorName,
      academicSurveySubjectId: s.surveySubjectId,
      id: s.surveySubjectId,
    } as any));
  }, [allSurveySubjects]);

  // Convertir preguntas de la encuesta actual a formato FixedQuestion
  const fixedQuestions: FixedQuestion[] = useMemo(() => {
    if (!currentSurvey?.questions) return [];
    
    return currentSurvey.questions.map((q: any) => {
      const rawType = q.type;
      const type: 'single' | 'multi' | 'text' =
        typeof rawType === 'number'
          ? rawType === 0
            ? 'single'
            : rawType === 1
            ? 'multi'
            : 'text'
          : rawType === 'SingleChoice'
          ? 'single'
          : rawType === 'MultipleChoice'
          ? 'multi'
          : 'text';

      return {
        id: q.id,
        text: q.text,
        type,
        options: q.options?.map((opt: any) => ({ value: opt.value, text: opt.text })),
        allowComment: (q as any).allowComment,
      } as FixedQuestion & { allowComment?: boolean };
    });
  }, [currentSurvey?.questions]);

  // Handler para mostrar confirmación cuando se completan todas las encuestas
  const handleSubmitAll = async () => {
    setShowConfirmDialog(true);
  };

  // Mutación para enviar respuestas
  const submitSurveyResponse = useSubmitSurveyResponse();

  // Handler para enviar realmente las respuestas (una sola petición por encuesta)
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Obtener todas las respuestas del store
      const allResponses = exportResponses();

      if (!surveyId) throw new Error('surveyId no disponible');

      // Enviar por cada subject
      for (const subject of allSurveySubjects) {
        const subjectId = subject.surveySubjectId;
        const data = (allResponses as any)[subjectId];
        if (!data) continue;

        const byQuestion: Record<string, { selectedValue?: number; text?: string }> = {};
        for (const resp of data.responses as Array<{ questionId: string; answer: any }>) {
          const qid = resp.questionId;
          const isComment = qid.endsWith('__comment');
          const baseId = isComment ? qid.replace(/__comment$/, '') : qid;
          if (!byQuestion[baseId]) byQuestion[baseId] = {};
          if (isComment) {
            const text = String(resp.answer || '').trim();
            if (text) byQuestion[baseId].text = text;
            continue;
          }
          const answer = resp.answer;

          
          if (Array.isArray(answer)) {
            const text = answer.map(String).filter(Boolean).join(', ');
            if (text) byQuestion[baseId].text = text;
          } else if (typeof answer === 'string' && isNaN(Number(answer))) {
            const text = String(answer || '').trim();
            if (text) byQuestion[baseId].text = text;
          } else if (answer !== undefined && answer !== null && String(answer) !== '') {
            byQuestion[baseId].selectedValue = parseInt(String(answer), 10);
          }
        }

        const subjectAnswers = Object.entries(byQuestion).map(([questionId, v]) => ({
          questionId,
          ...(v.selectedValue !== undefined ? { selectedValue: v.selectedValue } : {}),
          ...(v.text ? { text: v.text } : {}),
        }));

        await submitSurveyResponse.mutateAsync({ surveyId, surveySubjectId: subjectId, subjectAnswers });
      }

      console.log('Respuestas enviadas exitosamente');
      
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
          <PageLoader />
        </PageContent>
      </PageLayout>
    );
  }

  // Mostrar error si no se puede cargar la encuesta
  if (currentSurveyError || !currentSurvey || (!isLoadingSurveySubjects && allSurveySubjects.length === 0)) {
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
  const initialIndex = Math.max(0, surveyTargets.findIndex(t => t.subjectId === currentSubjectId));
  
  // Contador simple de progreso
  const simpleProgress = `${initialIndex + 1}/${surveyTargets.length || 1}`;

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
            fixedQuestions={fixedQuestions as any}
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