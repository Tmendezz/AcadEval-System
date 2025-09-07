import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
  isSubmitting = false,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    console.log("WizardNavigation - Botón Siguiente clickeado:", {
      currentStep,
      totalSteps,
      canProceed,
    });
    onNext();
  };

  const handlePrevious = () => {
    console.log("WizardNavigation - Botón Anterior clickeado:", {
      currentStep,
      totalSteps,
    });
    onPrevious();
  };

  console.log("WizardNavigation - Renderizando:", {
    currentStep,
    totalSteps,
    canProceed,
    isFirstStep,
    isLastStep,
  });

  return (
    <>
      <Separator className="my-8" />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {!isLastStep ? (
            <Button type="button" onClick={handleNext} disabled={!canProceed}>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={!canProceed || isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Evaluación"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
