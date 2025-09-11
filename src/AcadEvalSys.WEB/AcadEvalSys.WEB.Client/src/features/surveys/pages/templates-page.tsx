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
import { useState } from "react";

export default function TemplatesPage() {
  const [, setLocation] = useLocation();
  const { data: templates = [], isLoading } = useSurveyTemplates();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleCreateTemplate = () => {
    setLocation('/templates/crear');
  };

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
            onUseTemplate={async (t) => {
              if (isNavigating) return;
              setIsNavigating(true);
              // Navegar al page de creación con la plantilla precargada
              setLocation(`/encuestas/crear?templateId=${encodeURIComponent(t.id)}`);
            }}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
