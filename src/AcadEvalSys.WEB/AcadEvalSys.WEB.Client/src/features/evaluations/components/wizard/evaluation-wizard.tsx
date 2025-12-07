import { useCallback, useMemo, memo } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { WIZARD_STEPS } from "../../constants/wizard-steps";
import { EvaluationFormData } from "../../models/evaluation-form";
import { useEvaluationWizard } from "../../hooks/use-evaluation-wizard";
import { WizardStepIndicator } from "@/shared/components/wizard/WizardStepIndicator";
import { WizardNavigation } from "@/shared/components/wizard/WizardNavigation";
import { BasicInfoStep } from "./steps/basic-info-step";
import { CareerCompetencyAssignmentsStep } from "./steps/career-competency-assignments-step";
import { ReviewStep } from "./steps/review-step";

interface EvaluationWizardProps {
  onSubmit: (data: EvaluationFormData) => void;
  isSubmitting?: boolean;
}

export const EvaluationWizard = memo(function EvaluationWizard({
  onSubmit,
  isSubmitting = false,
}: EvaluationWizardProps) {
  const {
    currentStep,
    assignments,
    form,
    watchedValues,
    canProceed,
    nextStep,
    prevStep,
    updateAssignments,
    selectedCareers,
    expandedCareers,
    expandedYears,
    setSelectedCareers,
    setExpandedCareers,
    setExpandedYears,
  } = useEvaluationWizard();

  const handleFinalSubmit = useCallback(() => {
    onSubmit(watchedValues);
  }, [onSubmit, watchedValues]);

  // Memoizar el handler de siguiente paso
  const handleNext = useMemo(
    () => (currentStep < WIZARD_STEPS.length ? nextStep : handleFinalSubmit),
    [currentStep, nextStep, handleFinalSubmit]
  );

  // Renderizar contenido del paso actual
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return (
          <CareerCompetencyAssignmentsStep
            assignments={assignments}
            onAssignmentsChange={updateAssignments}
            selectedCareers={selectedCareers}
            expandedCareers={expandedCareers}
            expandedYears={expandedYears}
            onSelectedCareersChange={setSelectedCareers}
            onExpandedCareersChange={setExpandedCareers}
            onExpandedYearsChange={setExpandedYears}
          />
        );
      case 3:
        return <ReviewStep formData={watchedValues} assignments={assignments} />;
      default:
        return null;
    }
  }, [currentStep, form, assignments, updateAssignments, watchedValues]);

  return (
    <div className="px-4 mx-auto">
      <WizardStepIndicator currentStep={currentStep} steps={WIZARD_STEPS} />

      <Card>
        <CardContent className="pt-6">
          {stepContent}
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={WIZARD_STEPS.length}
            canProceed={canProceed()}
            onPrevious={prevStep}
            onNext={handleNext}
            isSubmitting={isSubmitting}
            finishLabel="Crear Evaluación"
          />
        </CardContent>
      </Card>
    </div>
  );
});
