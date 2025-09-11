import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { WizardStepIndicator } from '@/shared/components/wizard/WizardStepIndicator';
import { WizardStepTitle } from '@/shared/components/wizard/WizardStepTitle';
import { WizardNavigation } from '@/shared/components/wizard/WizardNavigation';
import { SurveyTemplateForm, SurveyTemplateQuestion } from '../../models/survey-template-types';
import { SurveyBasicInfoForm } from '../survey-basic-info-form';
import { SurveyQuestionsEditor } from '../survey-questions-editor';
import { SurveySettingsForm, SurveyAudience } from '../survey-settings-form';
import { validateStep } from '../../schemas/survey-validation-schemas';

interface SurveyWizardProps {
  onSubmit: (payload: { form: SurveyTemplateForm; settings: { audience: SurveyAudience; isAnonymous: boolean } }) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialTemplate?: {
    title?: string;
    description?: string;
    questions?: SurveyTemplateQuestion[];
  };
  fixedQuestions?: SurveyTemplateQuestion[]; // si se provee, el editor se bloquea y usa estas preguntas
}

export function SurveyWizard({ onSubmit, onCancel: _onCancel, isSubmitting = false, initialTemplate, fixedQuestions }: SurveyWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [form, setForm] = useState<SurveyTemplateForm>(() => ({
    title: initialTemplate?.title || '',
    description: initialTemplate?.description || '',
    questions: (fixedQuestions || initialTemplate?.questions) || [],
    surveyType: 0, // Default to Student
    isDraft: true,
  }));
  const [settings, setSettings] = useState<{ audience: SurveyAudience; isAnonymous: boolean }>({ audience: 'students', isAnonymous: true });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Actualizar el formulario cuando lleguen los datos de la plantilla
  useEffect(() => {
    if (initialTemplate && !fixedQuestions) {
      setForm({
        title: initialTemplate.title || '',
        description: initialTemplate.description || '',
        questions: initialTemplate.questions || [],
        surveyType: 0,
        isDraft: true,
      });
    }
  }, [initialTemplate, fixedQuestions]);

  const steps = [
    { id: 0, title: 'Diseñar formulario', description: 'Define el título, la descripción y agrega preguntas' },
    { id: 1, title: 'Configuración', description: 'Audiencia y privacidad del formulario' },
    { id: 2, title: 'Revisión', description: 'Verifica la información antes de crear la encuesta' },
  ];

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Validar el paso actual
  const validateCurrentStep = useCallback((): boolean => {
    const validationResult = validateStep(currentStep, form);
    setValidationErrors(validationResult.errors);
    return validationResult.isValid;
  }, [currentStep, form]);

  const canProceed = useMemo((): boolean => {
    const validationResult = validateStep(currentStep, form);
    return validationResult.isValid;
  }, [currentStep, form]);

  const handleSubmit = async () => {
    // Validar todo antes de enviar
    if (!validateCurrentStep()) {
      return;
    }
    await onSubmit({ form, settings });
  };

  return (
    <Card>
      <CardHeader>
        <WizardStepIndicator steps={steps} currentStep={currentStep} />
      </CardHeader>
      <CardContent className="space-y-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-3 text-sm">
              Las preguntas de la encuesta son fijas y se aplican automáticamente a todos los docentes del año de cursado de la tecnicatura correspondiente. No es necesario duplicarlas manualmente, el sistema generará un bloque de preguntas para cada docente.
            </div>
            <SurveyBasicInfoForm
              title={form.title}
              description={form.description}
              onChange={(u) => setForm((prev) => ({ ...prev, ...u }))}
              errors={validationErrors}
            />
            <SurveyQuestionsEditor
              questions={form.questions}
              onChange={(q: SurveyTemplateQuestion[]) => setForm((prev) => ({ ...prev, questions: q }))}
              showAddButton={!fixedQuestions}
              errors={validationErrors}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <SurveySettingsForm
              audience={settings.audience}
              isAnonymous={settings.isAnonymous}
              onChange={(u) => setSettings((prev) => ({ ...prev, ...u }))}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <div className="rounded-md border p-4 text-sm">
              <div className="mb-2"><strong>Título:</strong> {form.title || '—'}</div>
              <div className="mb-2"><strong>Descripción:</strong> {form.description || '—'}</div>
              <div className="mb-2"><strong>Preguntas:</strong> {form.questions.length}</div>
              <div className="mb-2"><strong>Audiencia:</strong> {settings.audience}</div>
              <div><strong>Respuestas anónimas:</strong> {settings.isAnonymous ? 'Sí' : 'No'}</div>
            </div>
          </div>
        )}

        <WizardNavigation
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          canProceed={canProceed}
          onPrevious={goPrev}
          onNext={async () => {
            if (currentStep < steps.length - 1) {
              if (canProceed) {
                return goNext();
              }
              return;
            }
            await handleSubmit();
          }}
          isSubmitting={isSubmitting}
          finishLabel="Crear Encuesta"
        />

      </CardContent>
    </Card>
  );
}


