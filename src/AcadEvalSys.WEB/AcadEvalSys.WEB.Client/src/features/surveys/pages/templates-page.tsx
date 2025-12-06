import { useCallback, useState } from "react";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { TemplateCards } from "../components/template-cards";
import { useSurveyTemplates } from "../hooks/use-survey-templates";
import { useSurveysStore } from "../store/use-surveys-store";

export default function TemplatesPage() {
  const [, setLocation] = useLocation();
  const { data: templates = [], isLoading } = useSurveyTemplates();
  const [isNavigating, setIsNavigating] = useState(false);
  const setSelectedTemplateId = useSurveysStore((state) => state.setSelectedTemplateId);
  
  const handleCreateTemplate = useCallback(() => {
    setLocation('/plantillas/crear');
  }, [setLocation]);

  const handleUseTemplate = useCallback(async (t: { id: string }) => {
    if (isNavigating) return;
    setIsNavigating(true);
    // Guardar el ID de la plantilla en el store
    setSelectedTemplateId(t.id);
    // Navegar al page de creación
    setLocation('/encuestas/crear');
  }, [isNavigating, setLocation, setSelectedTemplateId]);

  return (
    <PageLayout>
      <PageHeader
        title="Plantillas de Encuestas"
        description="Gestiona las plantillas de encuestas académicas"
      >
            <Button onClick={handleCreateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Plantilla
        </Button>
      </PageHeader>
      <PageContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Cargando plantillas...</div>
        ) : (
          <TemplateCards
            templates={templates}
            onUseTemplate={handleUseTemplate}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
