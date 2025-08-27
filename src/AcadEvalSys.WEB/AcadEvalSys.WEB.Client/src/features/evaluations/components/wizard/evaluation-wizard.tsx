import { Card, CardContent } from "@/shared/components/ui/card";
import { WIZARD_STEPS } from "../../constants/wizard-steps";
import { EvaluationFormData } from "../../types/evaluation-form";
import { useEvaluationWizard } from "../../hooks/use-evaluation-wizard";
import { WizardStepIndicator } from "./wizard-step-indicator";
import { WizardNavigation } from "./wizard-navigation";
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", watchedValues);
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
          {/* Solo renderizar el form en el último paso para evitar submit automático */}
          {currentStep === 3 ? (
            <form onSubmit={handleFormSubmit}>
              {renderStepContent()}
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={WIZARD_STEPS.length}
                canProceed={canProceed()}
                onPrevious={prevStep}
                onNext={nextStep}
                isSubmitting={isSubmitting}
              />
            </form>
          ) : (
            <>
              {renderStepContent()}
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={WIZARD_STEPS.length}
                canProceed={canProceed()}
                onPrevious={prevStep}
                onNext={nextStep}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
