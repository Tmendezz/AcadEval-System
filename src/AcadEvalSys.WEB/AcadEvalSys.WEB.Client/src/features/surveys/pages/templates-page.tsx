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
import { SurveyWizard } from "../components/wizard/survey-wizard";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { useState } from "react";
import { surveyTemplateService } from "../services/survey-template-service";
import type { SurveyTemplate } from "../models/survey-template-types";

export default function TemplatesPage() {
  const [, setLocation] = useLocation();
  const { data: templates = [], isLoading } = useSurveyTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  
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
              const detail = await surveyTemplateService.getTemplateById(t.id);
              setSelectedTemplate(detail);
            }}
          />
        )}
        <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl">
            {selectedTemplate && (
              <SurveyWizard
                onSubmit={async () => setLocation('/encuestas')}
                onCancel={() => setSelectedTemplate(null)}
                initialTemplate={{
                  title: selectedTemplate.title,
                  description: selectedTemplate.description,
                  questions: selectedTemplate.questions,
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </PageContent>
    </PageLayout>
  );
}
