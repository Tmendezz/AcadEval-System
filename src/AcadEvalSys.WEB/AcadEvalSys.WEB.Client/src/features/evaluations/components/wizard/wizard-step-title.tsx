import { WizardStep } from "../../types/evaluation-form";

interface WizardStepTitleProps {
  currentStep: number;
  steps: WizardStep[];
}

export function WizardStepTitle({ currentStep, steps }: WizardStepTitleProps) {
  const currentStepData = steps.find((step) => step.id === currentStep);

  if (!currentStepData) return null;

  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
      <p className="text-muted-foreground">{currentStepData.description}</p>
    </div>
  );
}
