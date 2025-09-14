import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { WizardStepIndicator } from '@/shared/components/wizard/WizardStepIndicator';
import { WizardStepTitle } from '@/shared/components/wizard/WizardStepTitle';
import { WizardNavigation } from '@/shared/components/wizard/WizardNavigation';
import { SurveyTemplateForm, SurveyTemplateQuestion } from '../../models/survey-template-types';
import { SurveyBasicInfoForm } from '../survey-basic-info-form';
import { SurveyQuestionsEditor } from '../survey-questions-editor';
import { SurveySettingsForm, SurveyAudience } from '../survey-settings-form';
import { AudienceCombination, TechnicalCareer } from '../survey-audience-selector';
import { validateStep } from '../../schemas/survey-validation-schemas';

interface SurveyWizardProps {
  onSubmit: (payload: { 
    form: SurveyTemplateForm; 
    settings: { 
      audience: SurveyAudience; 
      isAnonymous: boolean;
      selectedAudiences: AudienceCombination[];
    } 
  }) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialTemplate?: {
    title?: string;
    description?: string;
    questions?: SurveyTemplateQuestion[];
  };
  fixedQuestions?: SurveyTemplateQuestion[]; // si se provee, el editor se bloquea y usa estas preguntas
  careers: TechnicalCareer[];
  years: number[];
}

export function SurveyWizard({ onSubmit, onCancel: _onCancel, isSubmitting = false, initialTemplate, fixedQuestions, careers, years }: SurveyWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const normalizeType = (t: any): 'SingleChoice' | 'MultipleChoice' | 'OpenText' => {
    if (typeof t === 'string' && ['SingleChoice', 'MultipleChoice', 'OpenText'].includes(t)) {
      return t as 'SingleChoice' | 'MultipleChoice' | 'OpenText';
    }
    if (typeof t === 'number') {
      const map: Record<number, 'SingleChoice' | 'MultipleChoice' | 'OpenText'> = { 
        0: 'SingleChoice', 
        1: 'MultipleChoice', 
        2: 'OpenText' 
      };
      return map[t] ?? 'SingleChoice';
    }
    return 'SingleChoice';
  };

  const [form, setForm] = useState<SurveyTemplateForm>(() => ({
    title: initialTemplate?.title || '',
    description: initialTemplate?.description || '',
    questions: (fixedQuestions || initialTemplate?.questions || []).map((q, qi) => ({
      ...q,
      type: normalizeType((q as any).type),
      order: q.order ?? qi + 1,
      options: (q.options || []).map((o, oi) => ({
        ...o,
        order: o.order ?? oi + 1,
        value: typeof o.value === 'string' ? o.value : String(o.value ?? (o.order ?? oi + 1)),
      })),
    })),
    surveyType: 'Student', // Default to Student
    isDraft: true,
  }));
  const [settings, setSettings] = useState<{ 
    audience: SurveyAudience; 
    isAnonymous: boolean;
    selectedAudiences: AudienceCombination[];
  }>({ 
    audience: 'students', 
    isAnonymous: true,
    selectedAudiences: []
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Actualizar el formulario cuando lleguen los datos de la plantilla
  useEffect(() => {
    const templateQuestions = fixedQuestions || initialTemplate?.questions;
    if (templateQuestions) {
      const normalized = templateQuestions.map((q, qi) => ({
        ...q,
        type: normalizeType((q as any).type),
        order: q.order ?? qi + 1,
        options: (q.options || []).map((o, oi) => ({
          ...o,
          order: o.order ?? oi + 1,
          value: typeof o.value === 'string' ? o.value : String(o.value ?? (o.order ?? oi + 1)),
        })),
      }));
      setForm(prevForm => ({
        ...prevForm,
        title: initialTemplate?.title || prevForm.title,
        description: initialTemplate?.description || prevForm.description,
        questions: normalized,
      }));
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
              isDescriptionDisabled={true}
              showDescription={false}
            />
            <SurveyQuestionsEditor
              questions={form.questions}
              onChange={(q: SurveyTemplateQuestion[]) => setForm((prev) => ({ ...prev, questions: q }))}
              showAddButton={!fixedQuestions}
              errors={validationErrors}
              isReadOnly={!!fixedQuestions}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <SurveySettingsForm
              audience={settings.audience}
              isAnonymous={settings.isAnonymous}
              selectedAudiences={settings.selectedAudiences}
              onChange={(u) => setSettings((prev) => ({ ...prev, ...u }))}
              careers={careers}
              years={years}
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
              <div className="mb-2"><strong>Tipo de audiencia:</strong> {settings.audience}</div>
              <div className="mb-2"><strong>Respuestas anónimas:</strong> {settings.isAnonymous ? 'Sí' : 'No'}</div>
              <div className="mb-2"><strong>Audiencia específica:</strong></div>
              {settings.selectedAudiences.length > 0 ? (
                <div className="ml-4 text-sm">
                  {settings.selectedAudiences.map((audience, index) => (
                    <div key={index}>• {audience.careerName} - {audience.year}° Año</div>
                  ))}
                </div>
              ) : (
                <div className="ml-4 text-sm text-muted-foreground">Ninguna seleccionada</div>
              )}
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


