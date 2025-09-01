import { BookOpen } from "lucide-react";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";

export const EvaluationNotFoundState = () => {
  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Asignación no encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              La asignación que buscas no existe o no tienes permisos para
              acceder.
            </p>
          </div>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
};
