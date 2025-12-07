import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
// WizardStepTitle ya no se usa
import { WizardNavigation } from "@/shared/components/wizard/WizardNavigation";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { TEXT_RESPONSE_MAX_LENGTH } from "../../constants/surveys";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import { BookOpen, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useSurveyResponseStore } from "../../store/use-survey-response-store";

import type { FixedQuestion, StudentSurveyTarget } from "../../models/survey-runner-types";

interface StudentSurveyRunnerProps {
  assignments: StudentSurveyTarget[]; // docentes x asignatura del año del alumno
  fixedQuestions: FixedQuestion[]; // bloque fijo de preguntas
  onSubmitAll: () => Promise<void> | void;
  isSubmitting?: boolean;
  initialIndex?: number; // Índice inicial para empezar en una materia específica
}

export function StudentSurveyRunner({ assignments, fixedQuestions, onSubmitAll, isSubmitting = false, initialIndex = 0 }: StudentSurveyRunnerProps) {
  
  // Store de respuestas
  const {
    saveResponse,
    getSubjectResponses,
    markSubjectComplete,
    isSubjectComplete,
    setCurrentSubject,
    currentSubjectId,
  } = useSurveyResponseStore();

  // Calcular el índice actual basado en el currentSubjectId del store
  const currentIdx = useMemo(() => {
    if (!currentSubjectId || assignments.length === 0) return initialIndex;
    const foundIndex = assignments.findIndex(a => a.subjectId === currentSubjectId);
    return foundIndex >= 0 ? foundIndex : initialIndex;
  }, [currentSubjectId, assignments, initialIndex]);

  // Key de bloque = `${subjectId}:${teacherId}`
  const blockKey = useMemo(() => (unit: StudentSurveyTarget) => `${unit.subjectId}:${unit.teacherId}`, []);


  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>({});
  
  // Cargar respuestas desde el store cuando cambie la materia o el índice
  useEffect(() => {
    if (assignments.length > 0 && currentIdx >= 0 && currentIdx < assignments.length) {
      const currentAssignment = assignments[currentIdx];
      const subjectId = currentAssignment.subjectId;
      
      // Solo actualizar si cambió realmente la materia
      const key = blockKey(currentAssignment);
      
      // Cargar respuestas desde el store
      const storedResponses = getSubjectResponses(subjectId);
      
      // Convertir a formato local
      const currentAnswers: Record<string, any> = {};
      storedResponses.forEach(response => {
        currentAnswers[response.questionId] = response.answer;
      });
      
      // Actualizar el estado local
      setAnswers(prev => ({
        ...prev,
        [key]: currentAnswers
      }));
      
      // Las materias completadas se manejan directamente desde el store
      
      // Notificar al store sobre la materia actual
      setCurrentSubject(subjectId);
      
      // Hacer scroll al top cuando cambia la materia
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIdx]); // Solo cuando cambie el índice

  const current = assignments[currentIdx];
  
  // Verificar que current es válido
  if (!current) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No se encontró la evaluación actual</p>
      </div>
    );
  }
  
  const currentAnswers = answers[blockKey(current)] || {};

  const setAnswer = (questionId: string, value: any) => {
    // Actualizar estado local
    setAnswers((prev) => ({
      ...prev,
      [blockKey(current)]: {
        ...(prev[blockKey(current)] || {}),
        [questionId]: value,
      },
    }));
    
    // Guardar en el store
    const subjectId = current.subjectId;
    saveResponse(subjectId, questionId, value);
  };

  const canProceed = true; // se puede reforzar validación requerida

  const handleNext = async () => {
    // Prevenir múltiples llamadas si ya se está enviando
    if (isSubmitting) return;
    
    // Validar que todas las preguntas requeridas estén respondidas
    const hasRequiredAnswers = fixedQuestions.every(q => {
      const answer = currentAnswers[q.id];
      return answer !== undefined && answer !== null && answer !== '';
    });

    if (!hasRequiredAnswers) {
      toast.error("Por favor completa todas las preguntas antes de continuar");
      return;
    }

    // Marcar como completada en el store
    markSubjectComplete(current.subjectId);

    if (currentIdx < assignments.length - 1) {
      const nextIndex = currentIdx + 1;
      setCurrentSubject(assignments[nextIndex].subjectId);
    } else {
      // Cuando se completa la última materia, activar el modal de confirmación
      // Solo llamar si no se está enviando ya
      if (!isSubmitting) {
        void onSubmitAll();
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIndex = currentIdx - 1;
      setCurrentSubject(assignments[prevIndex].subjectId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de la encuesta */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium text-lg">{current.subjectName}</span>
            </div>
            {isSubjectComplete(current.subjectId) && (
              <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3" />
                Completada
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Profesor: {current.teacherName}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {fixedQuestions.map((q) => (
              <div key={q.id} className="space-y-2">
                <Label className="mb-1 block">{q.text}</Label>
                {q.type === "single" && (
                  <div role="radiogroup" className="space-y-2">
                    {q.options?.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={q.id}
                          checked={(currentAnswers[q.id] ?? "") === opt.value.toString()}
                          onChange={() => setAnswer(q.id, opt.value.toString())}
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "multi" && (
                  <div className="space-y-2">
                    {q.options?.map((opt) => {
                      const selected: string[] = currentAnswers[q.id] || [];
                      const checked = selected.includes(opt.value.toString());
                      return (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${q.id}-${opt.value}`}
                            checked={checked}
                            onCheckedChange={(c: boolean) => {
                              const next = new Set(selected);
                              if (c) next.add(opt.value.toString()); else next.delete(opt.value.toString());
                              setAnswer(q.id, Array.from(next));
                            }}
                          />
                          <Label htmlFor={`${q.id}-${opt.value}`}>{opt.text}</Label>
                        </div>
                      );
                    })}
                  </div>
                )}
                {q.type === "text" && (
                  <div>
                    <Textarea
                      rows={4}
                      value={currentAnswers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value.slice(0, TEXT_RESPONSE_MAX_LENGTH))}
                      placeholder="Escribe tu respuesta"
                      maxLength={TEXT_RESPONSE_MAX_LENGTH}
                    />
                    <div className="flex justify-end text-xs text-muted-foreground mt-1">
                      {(currentAnswers[q.id]?.length || 0)}/{TEXT_RESPONSE_MAX_LENGTH}
                    </div>
                  </div>
                )}
                {q.type !== "text" && (q as any).allowComment && (
                  <div className="mt-2">
                    <Label className="mb-1 block text-sm text-muted-foreground">Comentario/justificación (opcional)</Label>
                    <Textarea
                      rows={3}
                      value={currentAnswers[`${q.id}__comment`] ?? ""}
                      onChange={(e) => setAnswer(`${q.id}__comment`, e.target.value)}
                      placeholder="Escribe un comentario opcional"
                      maxLength={TEXT_RESPONSE_MAX_LENGTH}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <WizardNavigation
            currentStep={currentIdx + 1}
            totalSteps={assignments.length}
            canProceed={canProceed}
            onPrevious={handlePrev}
            onNext={handleNext}
            isSubmitting={isSubmitting}
            finishLabel={currentIdx === assignments.length - 1 ? `Finalizar encuesta${isSubjectComplete(current.subjectId) ? ' (Actualizar respuestas)' : ''}` : "Siguiente Materia"}
          />
        </CardContent>
      </Card>
    </div>
  );
}


