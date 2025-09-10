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

export function EvaluationWizard({
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
  } = useEvaluationWizard();

  const handleFinalSubmit = () => {
    onSubmit(watchedValues);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return (
          <CareerCompetencyAssignmentsStep
            assignments={assignments}
            onAssignmentsChange={updateAssignments}
          />
        );
      case 3:
        return (
          <ReviewStep formData={watchedValues} assignments={assignments} />
        );
      default:
        console.log("EvaluationWizard - Paso no reconocido:", currentStep);
        return null;
    }
  };

  return (
    <div className="px-4 mx-auto">
      <WizardStepIndicator currentStep={currentStep} steps={WIZARD_STEPS} />

      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={WIZARD_STEPS.length}
            canProceed={canProceed()}
            onPrevious={prevStep}
            onNext={currentStep < WIZARD_STEPS.length ? nextStep : handleFinalSubmit}
            isSubmitting={isSubmitting}
            finishLabel="Crear Evaluación"
          />
        </CardContent>
      </Card>
    </div>
  );
}
