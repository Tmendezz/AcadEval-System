import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { SurveyTemplates } from "../components/survey-templates";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function TemplatesPage() {
  const [, setLocation] = useLocation();
  
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
        <SurveyTemplates />
      </PageContent>
    </PageLayout>
  );
}
