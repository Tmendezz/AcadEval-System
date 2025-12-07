import { useMemo, useEffect, useState, useRef } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSurveyForResponse, useSubmitSurveyResponse, useSurveySubjectsForUser, userSurveysKeys } from '../hooks/use-surveys';
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
  const isMountedRef = useRef(true);
  const hasRedirectedRef = useRef(false);
  const queryClient = useQueryClient();

  // Store para manejar respuestas en memoria
  const {
    initializeSurvey,
    setCurrentSubject,
    getOverallProgress,
    clearSurvey,
    exportResponses,
    surveyId: storedSurveyId,
    currentSubjectId,
    subjectResponses,
  } = useSurveyResponseStore();

  // Limpiar refs cuando el componente se desmonta
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Obtener la encuesta actual usando el surveyId de la ruta
  // Deshabilitar la query si ya se redirigió para evitar refetch que cause 403
  const { data: currentSurvey, isLoading: isLoadingCurrentSurvey, error: currentSurveyError } = useSurveyForResponse(
    routeSurveyId || '', 
    false,
    { enabled: !hasRedirectedRef.current && !!routeSurveyId }
  );
  const surveyId = currentSurvey?.id || routeSurveyId || '';
  const { data: allSurveySubjects = [], isLoading: isLoadingSurveySubjects } = useSurveySubjectsForUser(
    surveyId,
    { enabled: !hasRedirectedRef.current && !!surveyId }
  );

  // Inicializar el store cuando tenemos encuesta y subjects
  useEffect(() => {
    if (currentSurvey && allSurveySubjects.length > 0) {
      const currentStoreSubjectsCount = Object.keys(subjectResponses).length;
      const surveySubjectIds = new Set(allSurveySubjects.map(s => s.surveySubjectId));
      const storeSubjectIds = new Set(Object.keys(subjectResponses));
      
      // Verificar si necesitamos reinicializar:
      // 1. Si es una encuesta diferente
      // 2. Si el número de subjects no coincide
      // 3. Si hay subjects en el store que no están en allSurveySubjects
      const needsReinit = 
        storedSurveyId !== currentSurvey.id ||
        currentStoreSubjectsCount !== allSurveySubjects.length ||
        Array.from(storeSubjectIds).some(id => !surveySubjectIds.has(id));
      
      if (needsReinit) {
        // Limpiar el store si es una encuesta diferente
        if (storedSurveyId !== currentSurvey.id) {
          clearSurvey();
        }
        
        // Inicializar con todos los subjects actuales
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
    }
  }, [currentSurvey?.id, currentSurvey?.title, allSurveySubjects, storedSurveyId, initializeSurvey, clearSurvey, subjectResponses]);
  
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
    // Prevenir múltiples llamadas
    if (isSubmitting) return;
    setShowConfirmDialog(true);
  };

  // Mutación para enviar respuestas
  const submitSurveyResponse = useSubmitSurveyResponse();

  // Handler para enviar realmente las respuestas (una sola petición por encuesta)
  const handleConfirmSubmit = async () => {
    // Prevenir doble envío
    if (isSubmitting || hasRedirectedRef.current) return;
    
    setIsSubmitting(true);
    try {
      // Obtener todas las respuestas del store
      const allResponses = exportResponses();

      if (!surveyId) throw new Error('surveyId no disponible');

      // Preparar todas las promesas de envío
      const submitPromises: Promise<void>[] = [];

      // Obtener todas las preguntas obligatorias para validación
      const requiredQuestionIds = new Set(
        (currentSurvey?.questions || [])
          .filter((q: any) => q.isRequired || q.IsRequired)
          .map((q: any) => q.id)
      );

      console.log('📊 [SUBMIT] Iniciando envío de respuestas', {
        surveyId,
        totalSubjects: allSurveySubjects.length,
        requiredQuestionIds: Array.from(requiredQuestionIds),
        allResponses: exportResponses(),
      });

      // Preparar envíos por cada subject
      for (const subject of allSurveySubjects) {
        const subjectId = subject.surveySubjectId;
        const data = (allResponses as any)[subjectId];
        
        console.log(`📝 [SUBMIT] Procesando subject: ${subject.subjectName} (${subjectId})`, {
          hasData: !!data,
          responsesCount: data?.responses?.length || 0,
          responses: data?.responses,
        });
        
        // Validar que data existe y tiene responses
        if (!data || !data.responses || !Array.isArray(data.responses) || data.responses.length === 0) {
          // Si hay preguntas obligatorias pero no hay respuestas, saltar este subject
          if (requiredQuestionIds.size > 0) {
            console.warn(`⚠️ [SUBMIT] Saltando subject ${subject.subjectName} - no tiene respuestas pero hay preguntas obligatorias`);
            continue;
          }
        }

        // Crear mapa de preguntas por ID para poder determinar el tipo
        const questionsById = new Map(
          (currentSurvey?.questions || []).map((q: any) => [q.id, q])
        );

        const byQuestion: Record<string, { selectedValue?: number; selectedValues?: number[]; text?: string }> = {};
        const answeredQuestionIds = new Set<string>();
        
        for (const resp of (data?.responses || []) as Array<{ questionId: string; answer: any }>) {
          if (!resp || !resp.questionId) {
            console.warn('⚠️ [SUBMIT] Respuesta inválida encontrada:', resp);
            continue;
          }
          
          const qid = resp.questionId;
          const isComment = qid.endsWith('__comment');
          const baseId = isComment ? qid.replace(/__comment$/, '') : qid;
          if (!byQuestion[baseId]) byQuestion[baseId] = {};
          if (isComment) {
            const text = String(resp.answer || '').trim();
            if (text) byQuestion[baseId].text = text;
            console.log(`💬 [SUBMIT] Comentario para pregunta ${baseId}:`, text);
            continue;
          }
          
          // Marcar que esta pregunta tiene respuesta
          answeredQuestionIds.add(baseId);
          
          const answer = resp.answer;
          
          // Obtener el tipo de pregunta para procesar correctamente
          const question = questionsById.get(baseId);
          const questionType = question?.type || question?.Type;
          const isSingleChoice = questionType === 'SingleChoice' || questionType === 0;
          const isMultipleChoice = questionType === 'MultipleChoice' || questionType === 1;
          const isOpenText = questionType === 'OpenText' || questionType === 2;
          
          console.log(`✅ [SUBMIT] Procesando respuesta para pregunta ${baseId}:`, {
            questionId: baseId,
            answer,
            answerType: typeof answer,
            isArray: Array.isArray(answer),
            questionType,
            isSingleChoice,
            isMultipleChoice,
            isOpenText,
          });

          // Procesar según el tipo de pregunta
          if (isOpenText) {
            // Para preguntas de texto abierto, usar el texto directamente
            const text = Array.isArray(answer) 
              ? answer.map(String).filter(Boolean).join(', ')
              : String(answer || '').trim();
            if (text) {
              byQuestion[baseId].text = text;
            }
          } else if (isSingleChoice) {
            // Para preguntas de opción única, usar selectedValue
            if (Array.isArray(answer)) {
              // Si es un array, tomar el primer valor numérico válido
              const firstValue = answer.find(v => {
                const num = parseInt(String(v), 10);
                return !isNaN(num) && num > 0;
              });
              if (firstValue !== undefined) {
                const numValue = parseInt(String(firstValue), 10);
                if (!isNaN(numValue)) {
                  byQuestion[baseId].selectedValue = numValue;
                }
              }
            } else {
              // Si no es array, convertir a número
              const numValue = parseInt(String(answer), 10);
              if (!isNaN(numValue) && numValue > 0) {
                byQuestion[baseId].selectedValue = numValue;
              }
            }
          } else if (isMultipleChoice) {
            // Para preguntas de opción múltiple, usar selectedValues (array)
            if (Array.isArray(answer)) {
              // Convertir todos los valores del array a números
              const numValues = answer
                .map(v => parseInt(String(v), 10))
                .filter(v => !isNaN(v) && v > 0);
              
              if (numValues.length > 0) {
                byQuestion[baseId].selectedValues = numValues;
                // También establecer selectedValue con el primer valor para compatibilidad
                byQuestion[baseId].selectedValue = numValues[0];
              }
            } else {
              // Si no es array, convertir a número (compatibilidad)
              const numValue = parseInt(String(answer), 10);
              if (!isNaN(numValue) && numValue > 0) {
                byQuestion[baseId].selectedValue = numValue;
                byQuestion[baseId].selectedValues = [numValue];
              }
            }
          } else {
            // Fallback: intentar determinar el tipo por el contenido
            if (Array.isArray(answer)) {
              // Si es array, intentar como opción múltiple
              const firstValue = answer.find(v => {
                const num = parseInt(String(v), 10);
                return !isNaN(num) && num > 0;
              });
              if (firstValue !== undefined) {
                const numValue = parseInt(String(firstValue), 10);
                if (!isNaN(numValue)) {
                  byQuestion[baseId].selectedValue = numValue;
                }
              } else {
                // Si no hay valores numéricos, usar como texto
                const text = answer.map(String).filter(Boolean).join(', ');
                if (text) byQuestion[baseId].text = text;
              }
            } else if (typeof answer === 'string' && isNaN(Number(answer))) {
              // String que no es número = texto
              const text = String(answer || '').trim();
              if (text) byQuestion[baseId].text = text;
            } else if (answer !== undefined && answer !== null && String(answer) !== '') {
              // Número = selectedValue
              const numValue = parseInt(String(answer), 10);
              if (!isNaN(numValue)) {
                byQuestion[baseId].selectedValue = numValue;
              }
            }
          }
        }

        console.log(`📋 [SUBMIT] Respuestas procesadas para ${subject.subjectName}:`, {
          byQuestion,
          answeredQuestionIds: Array.from(answeredQuestionIds),
        });

        // Verificar que todas las preguntas obligatorias tengan respuesta válida
        const missingRequiredQuestions: string[] = [];

        for (const requiredQId of requiredQuestionIds) {
          const question = questionsById.get(requiredQId);
          if (!question) continue;

          const answer = byQuestion[requiredQId];
          if (!answer) {
            missingRequiredQuestions.push(question.text || question.Text);
            continue;
          }

          // Validar según el tipo de pregunta
          const questionType = question.type || question.Type;
          const isSingleChoice = questionType === 'SingleChoice' || questionType === 0;
          const isMultipleChoice = questionType === 'MultipleChoice' || questionType === 1;
          const isOpenText = questionType === 'OpenText' || questionType === 2;

          if (isSingleChoice && !answer.selectedValue) {
            missingRequiredQuestions.push(question.text || question.Text);
          } else if (isMultipleChoice && !answer.selectedValue && !answer.selectedValues?.length) {
            missingRequiredQuestions.push(question.text || question.Text);
          } else if (isOpenText && (!answer.text || answer.text.trim() === '')) {
            missingRequiredQuestions.push(question.text || question.Text);
          }
        }

        if (missingRequiredQuestions.length > 0) {
          toast.error('Faltan respuestas obligatorias', {
            description: `Por favor, completa las siguientes preguntas obligatorias: ${missingRequiredQuestions.join(', ')}`,
            duration: 7000,
          });
          setIsSubmitting(false);
          return;
        }

        // Construir el payload de respuestas, asegurando que cada respuesta tenga al menos selectedValue, selectedValues o text
        const subjectAnswers = Object.entries(byQuestion)
          .map(([questionId, v]) => {
            const answer: { questionId: string; selectedValue?: number; selectedValues?: number[]; text?: string } = {
              questionId,
            };

            // Agregar selectedValues si existe (para preguntas de opción múltiple)
            if (v.selectedValues && v.selectedValues.length > 0) {
              answer.selectedValues = v.selectedValues;
            }

            // Solo agregar selectedValue si tiene valor válido
            if (v.selectedValue !== undefined && v.selectedValue !== null && !isNaN(v.selectedValue)) {
              answer.selectedValue = v.selectedValue;
            }

            // Solo agregar text si tiene contenido
            if (v.text && v.text.trim() !== '') {
              answer.text = v.text.trim();
            }

            // Validar que la respuesta tenga al menos selectedValue, selectedValues o text (requerido por el backend)
            if (answer.selectedValue === undefined && !answer.selectedValues?.length && !answer.text) {
              return null; // Filtrar respuestas inválidas
            }

            return answer;
          })
          .filter((answer): answer is { questionId: string; selectedValue?: number; selectedValues?: number[]; text?: string } => answer !== null);

        // Validar que todas las preguntas obligatorias estén en el payload
        const answeredQuestionIdsInPayload = new Set(subjectAnswers.map(a => a.questionId));
        const missingInPayload = Array.from(requiredQuestionIds).filter(
          qId => !answeredQuestionIdsInPayload.has(qId)
        );

        if (missingInPayload.length > 0) {
          const missingQuestions = (currentSurvey?.questions || [])
            .filter((q: any) => missingInPayload.includes(q.id))
            .map((q: any) => q.text || q.Text)
            .join(', ');
          
          toast.error('Faltan respuestas obligatorias en el payload', {
            description: `Las siguientes preguntas obligatorias no están incluidas: ${missingQuestions}`,
            duration: 7000,
          });
          setIsSubmitting(false);
          return;
        }

        // Solo agregar a la lista si hay respuestas válidas
        if (subjectAnswers.length > 0) {
          console.log(`🚀 [SUBMIT] Preparando envío para ${subject.subjectName}:`, {
            surveyId,
            surveySubjectId: subjectId,
            subjectAnswers,
            subjectAnswersCount: subjectAnswers.length,
            payload: JSON.stringify({ surveyId, surveySubjectId: subjectId, subjectAnswers }, null, 2),
          });
          
          submitPromises.push(
            submitSurveyResponse.mutateAsync({ surveyId, surveySubjectId: subjectId, subjectAnswers })
          );
        } else {
          console.warn(`⚠️ [SUBMIT] No hay respuestas válidas para ${subject.subjectName}, saltando envío`);
        }
      }

      console.log('📦 [SUBMIT] Resumen final antes de enviar:', {
        totalPromises: submitPromises.length,
        subjectsToSubmit: submitPromises.length,
      });

      // Verificar si hay respuestas para enviar
      if (submitPromises.length === 0) {
        toast.error('No hay respuestas para enviar', {
          description: 'Por favor, completa al menos una evaluación antes de enviar.',
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      // Enviar todas las respuestas en paralelo
      await Promise.all(submitPromises);
      
      // Verificar si el componente sigue montado antes de redirigir
      if (!isMountedRef.current || hasRedirectedRef.current) {
        setIsSubmitting(false);
        return;
      }
      
      // Marcar que ya se redirigió para prevenir múltiples redirecciones
      hasRedirectedRef.current = true;
      
      // Invalidar queries relacionadas para evitar refetch que cause 403
      // Esto evita que React Query intente recargar la encuesta después del envío
      await queryClient.invalidateQueries({
        queryKey: userSurveysKeys.all,
      });
      
      // Limpiar el store después de enviar exitosamente
      clearSurvey();
      
      // Cerrar el modal antes de redirigir
      setShowConfirmDialog(false);
      
      // Resetear el estado de envío antes de redirigir para que el spinner no se quede clavado
      setIsSubmitting(false);
      
      // Redirigir inmediatamente después de completar el envío
      setLocation('/encuestas/mis-encuestas?completed=true');
      
    } catch (error: any) {
      // Solo manejar errores si el componente sigue montado y no se ha redirigido
      if (!isMountedRef.current || hasRedirectedRef.current) {
        return;
      }
      
      // No limpiar el store para que el usuario pueda intentar de nuevo
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al enviar las respuestas. Por favor, intenta nuevamente.';
      toast.error('Error al enviar las respuestas', {
        description: errorMessage,
        duration: 5000,
      });
      
      // Resetear el estado de envío en caso de error
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
            isSubmitting={isSubmitting}
          />
        </div>
      </PageContent>

      {/* Modal de confirmación para enviar todas las respuestas */}
      <Dialog 
        open={showConfirmDialog} 
        onOpenChange={(open) => {
          // Prevenir cerrar mientras se está enviando
          if (!isSubmitting) {
            setShowConfirmDialog(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              ¿Enviar todas las respuestas?
            </DialogTitle>
            <DialogDescription>
              Has completado {getOverallProgress().completed} de {allSurveySubjects.length} evaluaciones. 
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