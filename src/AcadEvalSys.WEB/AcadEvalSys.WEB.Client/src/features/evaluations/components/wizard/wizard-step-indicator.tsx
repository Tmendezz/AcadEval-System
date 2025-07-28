import { Check } from "lucide-react";
import { WizardStep } from "../../types/evaluation-form";

interface WizardStepIndicatorProps {
  currentStep: number;
  steps: WizardStep[];
}

export function WizardStepIndicator({
  currentStep,
  steps,
}: WizardStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                currentStep >= step.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-muted-foreground text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 transition-colors ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
