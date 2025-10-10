import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  evaluationFormSchema,
  EvaluationFormSchema,
} from "../schemas/evaluation-form";
import { Assignment } from "../models/evaluation-form";
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
    handleSubmit: _handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const watchedValues = watch();

  const nextStep = () => {
    console.log("useEvaluationWizard - nextStep llamado:", {
      currentStep,
      totalSteps: WIZARD_STEPS.length,
      canProceed: canProceed(),
    });

    if (currentStep < WIZARD_STEPS.length) {
      const newStep = currentStep + 1;
      console.log("useEvaluationWizard - Cambiando al paso:", newStep);
      setCurrentStep(newStep);
    } else {
      console.log("useEvaluationWizard - Ya estamos en el último paso");
    }
  };

  const prevStep = () => {
    console.log("useEvaluationWizard - prevStep llamado:", {
      currentStep,
    });

    if (currentStep > 1) {
      const newStep = currentStep - 1;
      console.log("useEvaluationWizard - Cambiando al paso:", newStep);
      setCurrentStep(newStep);
    } else {
      console.log("useEvaluationWizard - Ya estamos en el primer paso");
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  };

  const updateAssignments = (newAssignments: Assignment[]) => {
    console.log("Assignments actualizados:", newAssignments);
    setAssignments(newAssignments);
    // Convertir las asignaciones al formato esperado por el backend
    const backendAssignments = newAssignments.map(
      ({ competencyId, subjectId }) => ({
        competencyId,
        subjectId,
      })
    );
    console.log("Formato backend:", backendAssignments);
    setValue("competencyAssignments", backendAssignments);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        // Verificar que todos los campos estén llenos
        const hasAllFields = !!(
          watchedValues.title &&
          watchedValues.description &&
          watchedValues.semester &&
          watchedValues.periodFrom &&
          watchedValues.periodTo
        );
        
        // Verificar que no haya errores de validación
        const hasNoErrors = !errors.title && !errors.description && !errors.periodFrom && !errors.periodTo;
        
        // Verificar que la fecha de fin sea posterior a la de inicio
        let datesValid = true;
        if (watchedValues.periodFrom && watchedValues.periodTo) {
          const from = new Date(watchedValues.periodFrom);
          const to = new Date(watchedValues.periodTo);
          datesValid = to > from;
        }
        
        return hasAllFields && hasNoErrors && datesValid;
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
        // Verificar que todos los campos estén llenos
        const hasAllFields = !!(
          watchedValues.title &&
          watchedValues.description &&
          watchedValues.semester &&
          watchedValues.periodFrom &&
          watchedValues.periodTo
        );
        
        // Verificar que no haya errores de validación
        const hasNoErrors = !errors.title && !errors.description && !errors.periodFrom && !errors.periodTo;
        
        // Verificar que la fecha de fin sea posterior a la de inicio
        let datesValid = true;
        if (watchedValues.periodFrom && watchedValues.periodTo) {
          const from = new Date(watchedValues.periodFrom);
          const to = new Date(watchedValues.periodTo);
          datesValid = to > from;
        }
        
        return hasAllFields && hasNoErrors && datesValid;
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
