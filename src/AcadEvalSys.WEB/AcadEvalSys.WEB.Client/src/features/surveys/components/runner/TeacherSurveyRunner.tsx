import { useState, useMemo } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { WizardStepIndicator } from "@/shared/components/wizard/WizardStepIndicator";
import { WizardStepTitle } from "@/shared/components/wizard/WizardStepTitle";
import { WizardNavigation } from "@/shared/components/wizard/WizardNavigation";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { TEXT_RESPONSE_MAX_LENGTH } from "../../constants/surveys";
import { Checkbox } from "@/shared/components/ui/checkbox";

import type { FixedQuestion, TeacherSurveyTarget } from "../../models/survey-runner-types";
import { submitSurveySubjectResponse } from "@/infrastructure/api/clients/academic-surveys";
import { toast } from "sonner";

interface TeacherSurveyRunnerProps {
  assignments: TeacherSurveyTarget[]; // alumnos por asignatura del profesor
  fixedQuestions: FixedQuestion[]; // bloque fijo de 5 preguntas
  onSubmitAll: (payload: { responses: Record<string, any> }) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function TeacherSurveyRunner({ assignments, fixedQuestions, onSubmitAll, isSubmitting = false }: TeacherSurveyRunnerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const blockKey = (unit: TeacherSurveyTarget) => `${unit.subjectId}:${unit.studentId}`;

  const steps = useMemo(
    () => assignments.map((a, i) => ({ id: i + 1, title: `${a.subjectName} — ${a.studentName}` })),
    [assignments]
  );

  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>({});
  const current = assignments[currentIdx];
  const currentAnswers = answers[blockKey(current)] || {};

  const setAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [blockKey(current)]: {
        ...(prev[blockKey(current)] || {}),
        [questionId]: value,
      },
    }));
  };

  const canProceed = true;
  const handleNext = async () => {
    try {
      const surveySubjectId = (current as any).academicSurveySubjectId || (current as any).id;
      const payload = fixedQuestions.map((q) => {
        const val = currentAnswers[q.id];
        if (q.type === "single") return { questionId: q.id, value: val };
        if (q.type === "multi") return { questionId: q.id, values: val || [] };
        return { questionId: q.id, text: val || "" };
      });
      await submitSurveySubjectResponse(surveySubjectId, payload);
    } catch (e: any) {
      toast.error("No se pudieron enviar las respuestas", { description: e?.message });
      return;
    }

    if (currentIdx < assignments.length - 1) setCurrentIdx((s) => s + 1);
    else void onSubmitAll({ responses: answers });
  };
  const handlePrev = () => setCurrentIdx((s) => Math.max(0, s - 1));

  return (
    <div className="space-y-4">
      <WizardStepIndicator currentStep={currentIdx + 1} steps={steps} />
      <Card>
        <CardContent className="pt-6 space-y-6">
          <WizardStepTitle currentStep={currentIdx + 1} steps={steps} />

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
            finishLabel="Enviar encuesta"
          />
        </CardContent>
      </Card>
    </div>
  );
}


