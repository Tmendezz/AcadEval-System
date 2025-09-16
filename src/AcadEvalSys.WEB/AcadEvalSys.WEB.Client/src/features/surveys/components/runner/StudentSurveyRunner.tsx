import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
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
import { submitSurveySubjectResponse } from "@/infrastructure/api/clients/academic-surveys";

interface StudentSurveyRunnerProps {
  assignments: StudentSurveyTarget[]; // docentes x asignatura del año del alumno
  fixedQuestions: FixedQuestion[]; // bloque fijo de preguntas
  onSubmitAll: () => Promise<void> | void;
  isSubmitting?: boolean;
  initialIndex?: number; // Índice inicial para empezar en una materia específica
}

export function StudentSurveyRunner({ assignments, fixedQuestions, onSubmitAll, isSubmitting = false, initialIndex = 0 }: StudentSurveyRunnerProps) {
  const [, setLocation] = useLocation();
  const [currentIdx] = useState(initialIndex); // Solo lectura, la navegación se hace por URL
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  
  // Store de respuestas
  const {
    saveResponse,
    getSubjectResponses,
    markSubjectComplete,
    isSubjectComplete,
    setCurrentSubject,
  } = useSurveyResponseStore();

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
      
      // Marcar como completado si ya está completado en el store
      setCompletedSections(prev => {
        const newSet = new Set(prev);
        if (isSubjectComplete(subjectId)) {
          newSet.add(currentIdx);
        } else {
          newSet.delete(currentIdx);
        }
        return newSet;
      });
      
      // Notificar al store sobre la materia actual
      setCurrentSubject(subjectId);
    }
  }, [currentIdx]); // Solo cuando cambie el índice

  const current = assignments[currentIdx];
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
    try {
      // Esperamos que cada target traiga un id para enviar respuestas
      const surveySubjectId = (current as any).academicSurveySubjectId || (current as any).id;
      const payload = fixedQuestions.map((q) => {
        const val = currentAnswers[q.id];
        if (q.type === "single") return { questionId: q.id, value: val };
        if (q.type === "multi") return { questionId: q.id, values: val || [] };
        return { questionId: q.id, text: val || "" };
      });
      await submitSurveySubjectResponse(surveySubjectId, payload);
      
      // Marcar sección como completada localmente
      setCompletedSections(prev => new Set([...prev, currentIdx]));
      
      // Marcar como completada en el store
      markSubjectComplete(current.subjectId);
      
      toast.success(`Respuestas de ${current.subjectName} guardadas`);
    } catch (e: any) {
      toast.error("No se pudieron enviar las respuestas", { description: e?.message });
      return;
    }

    if (currentIdx < assignments.length - 1) {
      const nextIndex = currentIdx + 1;
      const nextSurveySubjectId = assignments[nextIndex].subjectId;
      setLocation(`/encuestas/responder/${nextSurveySubjectId}`);
    } else {
      toast.success("¡Todas las encuestas completadas!");
      void onSubmitAll();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIndex = currentIdx - 1;
      const prevSurveySubjectId = assignments[prevIndex].subjectId;
      setLocation(`/encuestas/responder/${prevSurveySubjectId}`);
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
            {completedSections.has(currentIdx) && (
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
                      <label key={opt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={q.id}
                          checked={(currentAnswers[q.id] ?? "") === opt}
                          onChange={() => setAnswer(q.id, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "multi" && (
                  <div className="space-y-2">
                    {q.options?.map((opt) => {
                      const selected: string[] = currentAnswers[q.id] || [];
                      const checked = selected.includes(opt);
                      return (
                        <div key={opt} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${q.id}-${opt}`}
                            checked={checked}
                            onCheckedChange={(c: boolean) => {
                              const next = new Set(selected);
                              if (c) next.add(opt); else next.delete(opt);
                              setAnswer(q.id, Array.from(next));
                            }}
                          />
                          <Label htmlFor={`${q.id}-${opt}`}>{opt}</Label>
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
            finishLabel={`Finalizar encuesta${completedSections.has(currentIdx) ? ' (Actualizar respuestas)' : ''}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}


