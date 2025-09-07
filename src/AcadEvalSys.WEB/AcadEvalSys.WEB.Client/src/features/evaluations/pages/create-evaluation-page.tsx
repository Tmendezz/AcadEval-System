import {
  PageLayout,
  PageContent,
  PageHeader,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { EvaluationWizard } from "../components/wizard";
import { EvaluationFormData } from "../models/evaluation-form";
import { useCreateEvaluation } from "../hooks/use-create-evaluation";

export default function CreateEvaluationPage() {
  const { mutate: createEvaluation, isPending: isSubmitting } = useCreateEvaluation();

  const handleSubmit = async (data: EvaluationFormData) => {
    createEvaluation(data);
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
