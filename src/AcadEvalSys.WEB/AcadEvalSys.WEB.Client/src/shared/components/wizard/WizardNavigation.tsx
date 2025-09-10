import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number; // 1-based
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void; // caller decide si avanza o finaliza
  isSubmitting?: boolean;
  finishLabel?: string;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
  isSubmitting = false,
  finishLabel = "Finalizar",
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      <Separator className="my-8" />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {!isLastStep ? (
            <Button type="button" onClick={onNext} disabled={!canProceed}>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="button" onClick={onNext} disabled={!canProceed || isSubmitting}>
              {isSubmitting ? "Procesando..." : finishLabel}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}


