import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  evaluationFormSchema,
  EvaluationFormSchema,
} from "../schemas/evaluation-form";
import { Assignment } from "../models/evaluation-form";
import { WIZARD_STEPS } from "../constants/wizard-steps";

// Helper para validar el paso 1 usando Zod directamente
// Crear un schema específico para el paso 1 que incluya todas las validaciones
const step1Schema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  semester: z.enum(["First", "Second"]),
  periodFrom: z.string().min(1, "La fecha de inicio es requerida"),
  periodTo: z.string().min(1, "La fecha de fin es requerida"),
}).refine(
  (data) => {
    // Validar que la fecha de fin sea posterior a la de inicio
    if (data.periodFrom && data.periodTo) {
      const from = new Date(data.periodFrom);
      const to = new Date(data.periodTo);
      return to > from;
    }
    return true;
  },
  {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["periodTo"],
  }
);

const validateStep1 = (values: EvaluationFormSchema): boolean => {
  try {
    const result = step1Schema.safeParse({
      title: values.title,
      description: values.description,
      semester: values.semester,
      periodFrom: values.periodFrom,
      periodTo: values.periodTo,
    });
    
    return result.success;
  } catch {
    return false;
  }
};

// Helper para validar el paso 2
const validateStep2 = (assignments: Assignment[]): boolean => {
  return (
    assignments.length > 0 &&
    assignments.every((a) => a.competencyId && a.subjectId)
  );
};

interface UseEvaluationWizardOptions {
  initialData?: Partial<EvaluationFormSchema> & {
    competencyAssignments?: Array<{ competencyId: string; subjectId: string }>;
  };
}

export function useEvaluationWizard(options?: UseEvaluationWizardOptions) {
  const { initialData } = options || {};
  const [currentStep, setCurrentStep] = useState(1);
  
  // Convertir assignments iniciales al formato esperado
  const initialAssignments: Assignment[] = initialData?.competencyAssignments?.map(a => ({
    competencyId: a.competencyId,
    subjectId: a.subjectId,
  })) || [];
  
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  
  // Persistir carreras seleccionadas y estados expandidos entre pasos
  const [selectedCareers, setSelectedCareers] = useState<Set<string>>(new Set());
  const [expandedCareers, setExpandedCareers] = useState<Set<string>>(new Set());
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());

  const form = useForm<EvaluationFormSchema>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      semester: initialData?.semester || "First",
      periodFrom: initialData?.periodFrom || "",
      periodTo: initialData?.periodTo || "",
      competencyAssignments: initialData?.competencyAssignments || [],
    },
  });

  const { setValue, watch, formState: { errors } } = form;
  
  // Actualizar assignments cuando cambian los datos iniciales
  useEffect(() => {
    if (initialData?.competencyAssignments) {
      const newAssignments = initialData.competencyAssignments.map(a => ({
        competencyId: a.competencyId,
        subjectId: a.subjectId,
      }));
      setAssignments(newAssignments);
      const backendAssignments = newAssignments.map(
        ({ competencyId, subjectId }) => ({ competencyId, subjectId })
      );
      setValue("competencyAssignments", backendAssignments);
    }
  }, [initialData?.competencyAssignments, setValue]);
  const watchedValues = watch();

  const nextStep = useCallback(async () => {
    // Si estamos en el paso 1, validar antes de avanzar
    if (currentStep === 1) {
      // Validar con Zod directamente (mismo método que canProceed)
      const isValid = validateStep1(watchedValues);
      if (!isValid) {
        // También trigger la validación de react-hook-form para mostrar errores
        await form.trigger(["title", "description", "semester", "periodFrom", "periodTo"]);
        // No avanzar si hay errores de validación
        return;
      }
    }
    
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, form, watchedValues]);

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
        // Validar directamente con Zod para obtener resultado actualizado
        return validateStep1(watchedValues);
      case 2:
        return validateStep2(assignments);
      default:
        return true;
    }
  }, [currentStep, watchedValues, assignments]);

  const isStepCompleted = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return validateStep1(watchedValues);
        case 2:
          return validateStep2(assignments);
        default:
          return false;
      }
    },
    [watchedValues, assignments]
  );

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setAssignments([]);
    setSelectedCareers(new Set());
    setExpandedCareers(new Set());
    setExpandedYears(new Set());
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
    selectedCareers,
    expandedCareers,
    expandedYears,

    // Acciones
    nextStep,
    prevStep,
    goToStep,
    updateAssignments,
    resetWizard,
    setSelectedCareers,
    setExpandedCareers,
    setExpandedYears,

    // Validaciones
    canProceed,
    isStepCompleted,

    // Utilidades
    ...derivedState,
  };
}
