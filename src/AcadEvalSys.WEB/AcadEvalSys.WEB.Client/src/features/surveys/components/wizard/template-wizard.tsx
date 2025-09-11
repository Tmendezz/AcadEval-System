import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { WizardStepIndicator } from '@/shared/components/wizard/WizardStepIndicator';
import { WizardStepTitle } from '@/shared/components/wizard/WizardStepTitle';
import { WizardNavigation } from '@/shared/components/wizard/WizardNavigation';
import { SurveyTemplateForm, SurveyTemplateQuestion, SurveyTemplateType, QuestionType } from '../../models/survey-template-types';
import { SurveyQuestionsEditor } from '../survey-questions-editor';
import { SurveyBasicInfoForm } from '../survey-basic-info-form';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface TemplateWizardProps {
  onSubmit: (payload: SurveyTemplateForm) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TemplateWizard({ onSubmit, onCancel, isSubmitting = false }: TemplateWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<SurveyTemplateForm>({
    title: '',
    description: '',
    surveyType: SurveyTemplateType.Student,
    isDraft: true,
    questions: [],
  });

  const steps = [
    { id: 0, title: 'Información básica' },
    { id: 1, title: 'Configuración' },
    { id: 2, title: 'Revisión' },
  ];

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const canProceed = () => {
    if (currentStep === 0) {
      return form.title.trim().length > 0;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Limpiar el payload antes de enviarlo
    const cleanedForm = {
      ...form,
      questions: form.questions.map((question, index) => ({
        ...question,
        order: index, // Asegurar que el orden sea secuencial
        options: question.type === QuestionType.OpenText ? [] : question.options.map((option, optIndex) => ({
          ...option,
          order: optIndex // Asegurar que el orden de opciones sea secuencial
        }))
      }))
    };
    
    await onSubmit(cleanedForm);
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
                title: updates.title || prev.title,
                description: updates.description || prev.description
              }))}
            />
            <SurveyQuestionsEditor
              questions={form.questions as unknown as SurveyTemplateQuestion[]}
              onChange={(q) => setForm((prev) => ({ ...prev, questions: q as unknown as SurveyTemplateQuestion[] }))}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <div>
              <Label className="mb-1 block">Tipo de plantilla</Label>
              <Select value={form.surveyType.toString()} onValueChange={(v) => setForm((p) => ({ ...p, surveyType: Number(v) as SurveyTemplateType }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SurveyTemplateType.Student.toString()}>Estudiantes</SelectItem>
                  <SelectItem value={SurveyTemplateType.Professor.toString()}>Profesores</SelectItem>
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
              <div><strong>Tipo:</strong> {form.surveyType === SurveyTemplateType.Student ? 'Estudiantes' : 'Profesores'}</div>
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


