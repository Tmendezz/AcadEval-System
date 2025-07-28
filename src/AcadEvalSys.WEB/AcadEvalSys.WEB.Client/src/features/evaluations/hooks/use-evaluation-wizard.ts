import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  evaluationFormSchema,
  EvaluationFormSchema,
} from "../schemas/evaluation-form";
import { Assignment } from "../types/evaluation-form";
import { WIZARD_STEPS } from "../constants/wizard-steps";

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

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const watchedValues = watch();

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  };

  const updateAssignments = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    // Convertir las asignaciones al formato esperado por el backend
    const backendAssignments = newAssignments.map(
      ({ competencyId, subjectId }) => ({
        competencyId,
        subjectId,
      })
    );
    setValue("competencyAssignments", backendAssignments);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          watchedValues.title &&
          watchedValues.description &&
          watchedValues.semester &&
          watchedValues.periodFrom &&
          watchedValues.periodTo &&
          !errors.title &&
          !errors.description
        );
      case 2:
        return !!(
          assignments.length > 0 &&
          assignments.every((a) => a.competencyId && a.subjectId)
        );
      default:
        return true;
    }
  };

  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          watchedValues.title &&
          watchedValues.description &&
          watchedValues.semester &&
          watchedValues.periodFrom &&
          watchedValues.periodTo &&
          !errors.title &&
          !errors.description
        );
      case 2:
        return !!(
          assignments.length > 0 &&
          assignments.every((a) => a.competencyId && a.subjectId)
        );
      default:
        return false;
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setAssignments([]);
    form.reset();
  };

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
    totalSteps: WIZARD_STEPS.length,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === WIZARD_STEPS.length,
  };
}
