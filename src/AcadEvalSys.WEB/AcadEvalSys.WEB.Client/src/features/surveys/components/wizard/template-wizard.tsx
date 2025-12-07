import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { WizardStepIndicator } from '@/shared/components/wizard/WizardStepIndicator';
import { WizardStepTitle } from '@/shared/components/wizard/WizardStepTitle';
import { WizardNavigation } from '@/shared/components/wizard/WizardNavigation';
import { SurveyTemplateForm } from '../../models/survey-template-types';
import { SurveyQuestionsEditor } from '../survey-questions-editor';
import { SurveyBasicInfoForm } from '../survey-basic-info-form';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { SurveyTemplateFormSchema } from '../../schemas/survey-validation-schemas';
import { z } from 'zod';

interface TemplateWizardProps {
  onSubmit: (payload: SurveyTemplateForm) => Promise<void> | void;
  isSubmitting?: boolean;
  initialData?: SurveyTemplateForm;
}

export function TemplateWizard({ onSubmit, isSubmitting = false, initialData }: TemplateWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<SurveyTemplateForm>(() => ({
    title: initialData?.title ?? (initialData as any)?.name ?? '',
    description: initialData?.description ?? '',
    surveyType: initialData?.surveyType ?? 'Student',
    isDraft: initialData?.isDraft ?? true,
    questions: initialData?.questions ?? [],
  }));

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? (initialData as any)?.name ?? '',
        description: initialData.description ?? '',
        surveyType: initialData.surveyType ?? 'Student',
        isDraft: initialData.isDraft ?? true,
        questions: initialData.questions ?? [],
      });
    }
  }, [initialData]);

  const steps = [
    { id: 0, title: initialData ? 'Editar información básica' : 'Información básica' },
    { id: 1, title: 'Configuración' },
    { id: 2, title: 'Revisión' },
  ];

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Schema para validar el paso 0 (información básica y preguntas)
  const step0Schema = z.object({
    title: z.string()
      .min(1, 'El título es obligatorio')
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(120, 'El título no puede exceder 120 caracteres'),
    description: z.string()
      .min(1, 'La descripción es obligatoria')
      .min(10, 'La descripción debe tener al menos 10 caracteres')
      .max(300, 'La descripción no puede exceder 300 caracteres'),
    questions: z.array(z.any())
      .min(1, 'Debe agregar al menos una pregunta')
      .max(50, 'No puede haber más de 50 preguntas'),
  });

  // Validar paso 0
  const validateStep0 = useCallback((data: SurveyTemplateForm): boolean => {
    try {
      const result = step0Schema.safeParse({
        title: data.title,
        description: data.description,
        questions: data.questions || [],
      });
      
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
        return false;
      }
      
      // Validar preguntas individuales
      const questionErrors: Record<string, string> = {};
      if (data.questions && data.questions.length > 0) {
        data.questions.forEach((question, index) => {
          if (!question.text || question.text.trim().length === 0) {
            questionErrors[`question_${index}_text`] = 'El texto de la pregunta es obligatorio';
          }
          if ((question.type === 'SingleChoice' || question.type === 'MultipleChoice')) {
            if (!question.options || question.options.length === 0) {
              questionErrors[`question_${index}_options`] = 'Las preguntas de opción múltiple deben tener al menos una opción';
            }
          }
        });
      }
      
      if (Object.keys(questionErrors).length > 0) {
        setValidationErrors({ ...validationErrors, ...questionErrors });
        return false;
      }
      
      setValidationErrors({});
      return true;
    } catch {
      return false;
    }
  }, []);

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 0:
        return validateStep0(form);
      case 1:
        return true; // Paso de configuración siempre puede avanzar
      case 2:
        return true; // Paso de revisión siempre puede avanzar
      default:
        return true;
    }
  }, [currentStep, form, validateStep0]);

  const goNext = useCallback(() => {
    // Validar antes de avanzar
    if (currentStep === 0) {
      if (!validateStep0(form)) {
        return; // No avanzar si hay errores
      }
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [currentStep, form, validateStep0]);

  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Función para convertir QuestionType string a número
  const convertQuestionTypeToNumber = (type: string): number => {
    switch (type) {
      case 'SingleChoice': return 0;
      case 'MultipleChoice': return 1;
      case 'OpenText': return 2;
      default: return 0;
    }
  };

  // Función para limpiar datos antes de enviar
  const cleanFormData = (formData: SurveyTemplateForm) => {
    return {
      ...formData,
      questions: formData.questions.map((question, index) => {
        const cleanedQuestion: any = {
          text: question.text,
          type: convertQuestionTypeToNumber(question.type), // Convertir a número
          order: question.order || (index + 1),
          required: question.required,
          allowComment: question.allowComment || false,
        };

        // Solo agregar opciones si no es texto abierto
        if (question.type !== 'OpenText') {
          cleanedQuestion.options = question.options.map((option, optIndex) => ({
            text: option.text,
            value: option.value,
            order: option.order || (optIndex + 1),
            allowOpenText: option.allowOpenText
          }));
        }

        return cleanedQuestion;
      })
    };
  };

  const handleSubmit = async () => {
    // Limpiar datos antes de enviar
    const cleanedForm = cleanFormData(form);
    await onSubmit(cleanedForm as any); // Cast temporal para evitar error de tipo
  };

  return (
    <Card>
      <CardHeader>
        <WizardStepIndicator steps={steps} currentStep={currentStep + 1} />
      </CardHeader>
      <CardContent className="space-y-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <SurveyBasicInfoForm
              title={form.title}
              description={form.description}
              onChange={(updates) => {
                setForm((prev) => ({ 
                  ...prev, 
                  ...(updates.title !== undefined && { title: updates.title }),
                  ...(updates.description !== undefined && { description: updates.description })
                }));
                // Limpiar errores del campo cuando se modifica
                if (updates.title !== undefined) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.title;
                    return newErrors;
                  });
                }
                if (updates.description !== undefined) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.description;
                    return newErrors;
                  });
                }
              }}
              errors={validationErrors}
              isTemplate
            />
            <SurveyQuestionsEditor
              questions={form.questions}
              onChange={(q) => {
                setForm((prev) => ({ ...prev, questions: q }));
                // Limpiar errores de preguntas cuando se modifican
                setValidationErrors((prev) => {
                  const newErrors = { ...prev };
                  Object.keys(newErrors).forEach((key) => {
                    if (key.startsWith('question_')) {
                      delete newErrors[key];
                    }
                  });
                  delete newErrors.questions;
                  return newErrors;
                });
              }}
              errors={validationErrors}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <div>
              <Label className="mb-1 block">Tipo de plantilla</Label>
              <Select value={form.surveyType} onValueChange={(v) => setForm((p) => ({ ...p, surveyType: v as 'Student' | 'Professor' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Estudiantes</SelectItem>
                  <SelectItem value="Professor">Profesores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <div className="rounded-md border p-4 text-sm space-y-2">
              <div><strong>Título:</strong> {form.title || 'Sin título'}</div>
              <div><strong>Descripción:</strong> {form.description || 'Sin descripción'}</div>
              <div><strong>Preguntas:</strong> {form.questions.length}</div>
              <div><strong>Tipo:</strong> {form.surveyType === 'Student' ? 'Estudiantes' : 'Profesores'}</div>
            </div>
          </div>
        )}

        <WizardNavigation
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          canProceed={canProceed()}
          onPrevious={goPrev}
          onNext={async () => {
            if (currentStep < steps.length - 1) return goNext();
            await handleSubmit();
          }}
          isSubmitting={isSubmitting}
          finishLabel="Guardar plantilla"
        />
      </CardContent>
    </Card>
  );
}


