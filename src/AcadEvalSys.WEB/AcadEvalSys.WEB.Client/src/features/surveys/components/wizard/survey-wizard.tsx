import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { WizardStepIndicator } from '@/shared/components/wizard/WizardStepIndicator';
import { WizardStepTitle } from '@/shared/components/wizard/WizardStepTitle';
import { WizardNavigation } from '@/shared/components/wizard/WizardNavigation';
import { SurveyTemplateForm, SurveyTemplateQuestion } from '../../models/survey-template-types';
import { SurveyBasicInfoForm } from '../survey-basic-info-form';
import { SurveyQuestionsEditor } from '../survey-questions-editor';
import { SurveySettingsForm, SurveyAudience } from '../survey-settings-form';
import { SurveySchedulingForm } from '../survey-scheduling-form';
import { TechnicalCareer } from '../../hooks/use-surveys';
import { CareerYear } from '../../models/survey-types';
import { validateStep } from '../../schemas/survey-validation-schemas';
import { formatDateForDisplay } from '@/shared/utils/date-utils';

interface SurveyWizardProps {
  onSubmit: (payload: { 
    form: SurveyTemplateForm; 
    settings: { 
      audience: SurveyAudience; 
      isAnonymous: boolean;
      selectedCareerIds: string[];
      selectedYears: CareerYear[];
    };
    scheduling: {
      publishAt?: string;
      closeAt?: string;
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
  initialScheduling?: { publishAt?: string; closeAt?: string };
}

export function SurveyWizard({ onSubmit, onCancel: _onCancel, isSubmitting = false, initialTemplate, fixedQuestions, careers, initialScheduling }: SurveyWizardProps) {
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

  const [form, setForm] = useState<SurveyTemplateForm>(() => {
    const questions = fixedQuestions || initialTemplate?.questions || [];
    
    return {
      title: initialTemplate?.title || '',
      description: initialTemplate?.description || '',
      questions: questions.map((q, qi) => {
        const processedQuestion = {
          ...q,
          type: normalizeType((q as any).type),
          order: q.order ?? qi + 1,
          allowComment: (q as any).allowComment || (q as any).AllowComment || false,
          options: (q.options || []).map((o, oi) => ({
            ...o,
            order: o.order ?? oi + 1,
            value: typeof o.value === 'string' ? o.value : String(o.value ?? (o.order ?? oi + 1)),
          })),
        };
        return processedQuestion;
      }),
      surveyType: 'Student', // Default to Student
      isDraft: true,
    };
  });
  const [settings, setSettings] = useState<{ 
    audience: SurveyAudience; 
    isAnonymous: boolean;
    selectedCareerIds: string[];
    selectedYears: CareerYear[];
  }>({ 
    audience: 'students', 
    isAnonymous: true,
    selectedCareerIds: [], // Inicialmente vacío significa que todas están incluidas
    selectedYears: []
  });
  
  const [scheduling, setScheduling] = useState<{
    publishAt?: string;
    closeAt?: string;
  }>({
    publishAt: initialScheduling?.publishAt || '',
    closeAt: initialScheduling?.closeAt || ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Actualizar solo las preguntas cuando lleguen los datos de la plantilla
  // El título y descripción se pueden editar libremente y no se sobrescriben
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
        // Solo actualizamos las preguntas, no el título ni la descripción
        // para permitir que el usuario los edite libremente
        questions: normalized,
      }));
    }
  }, [initialTemplate, fixedQuestions]);

  const steps = [
    { id: 0, title: 'Diseñar formulario', description: 'Define el título, la descripción y agrega preguntas' },
    { id: 1, title: 'Configuración', description: 'Audiencia, fechas y privacidad del formulario' },
    { id: 2, title: 'Revisión', description: 'Verifica la información antes de crear la encuesta' },
  ];

  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // En este wizard mostramos descripción para encuestas, así que validamos normalmente (no como plantilla)
  const usingTemplateBasicInfo = false;
  // Ahora todas las preguntas son editables, así que siempre validamos normalmente

  // Validar el paso actual - validar en tiempo real cuando cambian los datos
  const validateCurrentStep = useCallback((): boolean => {
    const validationResult = validateStep(currentStep, form, usingTemplateBasicInfo, false, scheduling, settings);
    setValidationErrors(validationResult.errors);
    return validationResult.isValid;
  }, [currentStep, form, usingTemplateBasicInfo, scheduling, settings]);

  // Función para avanzar al siguiente paso con validación
  const goNext = useCallback(() => {
    // Validar antes de avanzar
    const validationResult = validateStep(currentStep, form, usingTemplateBasicInfo, false, scheduling, settings);
    setValidationErrors(validationResult.errors);
    
    if (validationResult.isValid) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  }, [currentStep, form, usingTemplateBasicInfo, scheduling, settings, steps.length]);

  // Validar en tiempo real cuando cambia el formulario o scheduling
  useEffect(() => {
    if (currentStep === 0) {
      const validationResult = validateStep(currentStep, form, usingTemplateBasicInfo, false, scheduling, settings);
      setValidationErrors(validationResult.errors);
    } else if (currentStep === 1) {
      const validationResult = validateStep(currentStep, form, usingTemplateBasicInfo, false, scheduling, settings);
      setValidationErrors(validationResult.errors);
    }
  }, [form, scheduling, settings, currentStep, usingTemplateBasicInfo]);

  const canProceed = useMemo((): boolean => {
    const validationResult = validateStep(currentStep, form, usingTemplateBasicInfo, false, scheduling, settings);
    return validationResult.isValid;
  }, [currentStep, form, usingTemplateBasicInfo, scheduling, settings]);

  const handleSubmit = async () => {
    // Validar todo antes de enviar
    if (!validateCurrentStep()) {
      return;
    }
    await onSubmit({ form, settings, scheduling });
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
            <div className="rounded-md border border-blue-300 bg-blue-50 text-blue-900 p-3 text-sm">
              Las preguntas de la encuesta se aplican automáticamente a todos los docentes del año de cursado de la tecnicatura correspondiente. No es necesario duplicarlas manualmente, el sistema generará un bloque de preguntas para cada docente.
              {fixedQuestions && (
                <div className="mt-2 pt-2 border-t border-blue-400">
                  <strong>Plantilla seleccionada:</strong> Los campos han sido prellenados desde la plantilla, pero puedes editarlos libremente para personalizar esta encuesta específica.
                </div>
              )}
            </div>
            <SurveyBasicInfoForm
              title={form.title}
              description={form.description}
              onChange={(u) => setForm((prev) => ({ ...prev, ...u }))}
              errors={validationErrors}
              isTemplate={false}
              showDescription={true}
              isTitleDisabled={false}
              isDescriptionDisabled={false}
            />
            <SurveyQuestionsEditor
              questions={form.questions}
              onChange={(q: SurveyTemplateQuestion[]) => setForm((prev) => ({ ...prev, questions: q }))}
              showAddButton={true}
              errors={validationErrors}
              isReadOnly={false}
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <WizardStepTitle currentStep={currentStep} steps={steps} />
            <SurveySchedulingForm
              publishAt={scheduling.publishAt}
              closeAt={scheduling.closeAt}
              onChange={(u) => {
                setScheduling(prev => ({ ...prev, ...u }));
                // Limpiar errores del campo cuando se modifica
                if (u.publishAt !== undefined) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.publishAt;
                    return newErrors;
                  });
                }
                if (u.closeAt !== undefined) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.closeAt;
                    return newErrors;
                  });
                }
              }}
              errors={validationErrors}
            />
            <SurveySettingsForm
              audience={settings.audience}
              isAnonymous={settings.isAnonymous}
              selectedCareerIds={settings.selectedCareerIds}
              selectedYears={settings.selectedYears}
              onChange={(u) => setSettings((prev) => ({ ...prev, ...u }))}
              careers={careers}
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
              <div className="mb-2"><strong>Fecha de publicación:</strong> {
                scheduling.publishAt 
                  ? formatDateForDisplay(new Date(scheduling.publishAt))
                  : 'No configurada'
              }</div>
              <div className="mb-2"><strong>Fecha de cierre:</strong> {
                scheduling.closeAt
                  ? formatDateForDisplay(new Date(scheduling.closeAt))
                  : 'No configurada'
              }</div>
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
              // Validar antes de avanzar
              goNext();
              return;
            }
            // En el último paso, validar antes de enviar
            if (validateCurrentStep()) {
              await handleSubmit();
            }
          }}
          isSubmitting={isSubmitting}
          finishLabel="Crear Encuesta"
        />

      </CardContent>
    </Card>
  );
}


