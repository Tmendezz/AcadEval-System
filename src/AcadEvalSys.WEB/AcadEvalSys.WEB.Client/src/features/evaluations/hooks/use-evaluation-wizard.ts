import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  evaluationFormSchema,
  EvaluationFormSchema,
} from "../schemas/evaluation-form";
import { Assignment } from "../models/evaluation-form";
import { WIZARD_STEPS } from "../constants/wizard-steps";

// Helper para validar el paso 1
const validateStep1 = (
  values: EvaluationFormSchema,
  errors: Record<string, unknown>
): boolean => {
  const hasAllFields = !!(
    values.title &&
    values.description &&
    values.semester &&
    values.periodFrom &&
    values.periodTo
  );

  const hasNoErrors =
    !errors.title && !errors.description && !errors.periodFrom && !errors.periodTo;

  let datesValid = true;
  if (values.periodFrom && values.periodTo) {
    datesValid = new Date(values.periodTo) > new Date(values.periodFrom);
  }

  return hasAllFields && hasNoErrors && datesValid;
};

// Helper para validar el paso 2
const validateStep2 = (assignments: Assignment[]): boolean => {
  return (
    assignments.length > 0 &&
    assignments.every((a) => a.competencyId && a.subjectId)
  );
};

export function useEvaluationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const form = useForm<EvaluationFormSchema>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      semester: "First",
      periodFrom: "",
      periodTo: "",
      competencyAssignments: [],
    },
  });

  const { setValue, watch, formState: { errors } } = form;
  const watchedValues = watch();

  const nextStep = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const updateAssignments = useCallback(
    (newAssignments: Assignment[]) => {
      setAssignments(newAssignments);
      const backendAssignments = newAssignments.map(
        ({ competencyId, subjectId }) => ({ competencyId, subjectId })
      );
      setValue("competencyAssignments", backendAssignments);
    },
    [setValue]
  );

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1(watchedValues, errors);
      case 2:
        return validateStep2(assignments);
      default:
        return true;
    }
  }, [currentStep, watchedValues, errors, assignments]);

  const isStepCompleted = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return validateStep1(watchedValues, errors);
        case 2:
          return validateStep2(assignments);
        default:
          return false;
      }
    },
    [watchedValues, errors, assignments]
  );

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setAssignments([]);
    form.reset();
  }, [form]);

  // Valores derivados memoizados
  const derivedState = useMemo(
    () => ({
      totalSteps: WIZARD_STEPS.length,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === WIZARD_STEPS.length,
    }),
    [currentStep]
  );

  return {
    // Estado
    currentStep,
    assignments,
    form,
    watchedValues,
    errors,

    // Acciones
    nextStep,
    prevStep,
    goToStep,
    updateAssignments,
    resetWizard,

    // Validaciones
    canProceed,
    isStepCompleted,

    // Utilidades
    ...derivedState,
  };
}
