import { useState } from "react";
import {
  PageLayout,
  PageContent,
  PageHeader,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { EvaluationWizard } from "../components/wizard";
import { EvaluationFormData } from "../types/evaluation-form";
import { createEvaluation } from "../services/evaluation-service";
import { toast } from "sonner";

export default function CreateEvaluationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EvaluationFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Datos de la evaluación:", data);

      // Llamada real al backend
      await createEvaluation(data);

      toast.success("Evaluación creada exitosamente");
      console.log("Evaluación creada exitosamente");

      // Aquí podrías redirigir a la lista de evaluaciones
      // navigate("/evaluations");
    } catch (error) {
      console.error("Error al crear la evaluación:", error);
      toast.error("Error al crear la evaluación. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader title="Crear Evaluación" />
      <PageContent>
        <PageSection>
          <EvaluationWizard
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
