import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ContainerPage } from "@/shared/components/container-page";
import { SurveyTemplatesList } from "../components/survey-templates-list";
import { useDeleteSurveyTemplate } from "../hooks/use-survey-templates";
import {
  SurveyTemplate,
  SurveyTemplatesFilters,
} from "@/shared/types";

export default function TemplatesPage() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<SurveyTemplatesFilters>({});
  
  const deleteTemplateMutation = useDeleteSurveyTemplate();

  const handleView = (template: SurveyTemplate) => {
    setLocation(`/surveys/templates/${template.id}`);
  };

  const handleEdit = (template: SurveyTemplate) => {
    setLocation(`/surveys/templates/${template.id}/edit`);
  };

  const handleDelete = async (template: SurveyTemplate) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la plantilla "${template.title}"?`)) {
      try {
        await deleteTemplateMutation.mutateAsync(template.id);
        toast.success("Plantilla eliminada correctamente");
      } catch (error) {
        toast.error("Error al eliminar la plantilla");
      }
    }
  };

  const handleCreate = () => {
    setLocation("/surveys/templates/new");
  };

  return (
    <ContainerPage>
      <SurveyTemplatesList
        filters={filters}
        onFiltersChange={setFilters}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
    </ContainerPage>
  );
}
