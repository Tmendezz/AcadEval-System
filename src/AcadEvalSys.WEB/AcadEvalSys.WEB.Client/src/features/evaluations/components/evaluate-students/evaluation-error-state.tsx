import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";

interface EvaluationErrorStateProps {
  error?: Error | null;
  onRetry: () => void;
}

export const EvaluationErrorState = ({
  error,
  onRetry,
}: EvaluationErrorStateProps) => {
  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error al cargar los datos
            </h3>
            <p className="text-muted-foreground mb-4">
              {error?.message ||
                "No se pudieron cargar los datos de la asignación."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onRetry} variant="outline">
                Reintentar
              </Button>
              <Button asChild>
                <Link href="/evaluaciones/docentes/mis-evaluaciones">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a mis evaluaciones
                </Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
};
