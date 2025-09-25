import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { WizardStepIndicator } from '@/shared/components/wizard/WizardStepIndicator';
import { WizardStepTitle } from '@/shared/components/wizard/WizardStepTitle';
import { WizardNavigation } from '@/shared/components/wizard/WizardNavigation';
import { SurveyTemplateForm } from '../../models/survey-template-types';
import { SurveyQuestionsEditor } from '../survey-questions-editor';
import { SurveyBasicInfoForm } from '../survey-basic-info-form';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

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

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const canProceed = () => true;

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
              onChange={(updates) => setForm((prev) => ({ 
                ...prev, 
                ...(updates.title !== undefined && { title: updates.title }),
                ...(updates.description !== undefined && { description: updates.description })
              }))}
              isTemplate
            />
            <SurveyQuestionsEditor
              questions={form.questions}
              onChange={(q) => setForm((prev) => ({ ...prev, questions: q }))}
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


