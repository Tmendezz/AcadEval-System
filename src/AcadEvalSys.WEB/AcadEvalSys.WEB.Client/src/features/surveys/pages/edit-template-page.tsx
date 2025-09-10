import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { ContainerPage } from "@/shared/components/container-page";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { SurveyTemplateForm } from "../components/survey-template-form";
import { useSurveyTemplate, useUpdateSurveyTemplate } from "../hooks/use-survey-templates";
import { useSurveyTemplateStore } from "../store/use-survey-template-store";
import {
  UpdateSurveyTemplateRequest,
} from "@/shared/types";

export default function EditTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { loadTemplate, resetForm } = useSurveyTemplateStore();
  
  const { data: template, isLoading, error } = useSurveyTemplate(id!);
  const updateTemplateMutation = useUpdateSurveyTemplate();

  // Cargar la plantilla en el store cuando esté disponible
  useEffect(() => {
    if (template) {
      loadTemplate(template);
    }
    
    return () => {
      resetForm();
    };
  }, [template, loadTemplate, resetForm]);

  const handleSave = async (updatedTemplate: UpdateSurveyTemplateRequest) => {
    if (!id) return;
    
    try {
      await updateTemplateMutation.mutateAsync({ 
        id, 
        template: updatedTemplate 
      });
      toast.success("Plantilla actualizada correctamente");
      setLocation("/surveys/templates");
    } catch (error) {
      toast.error("Error al actualizar la plantilla");
      console.error("Error updating template:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setLocation("/surveys/templates");
  };

  if (isLoading) {
    return (
      <ContainerPage>
        <LoadingState message="Cargando plantilla..." />
      </ContainerPage>
    );
  }

  if (error || !template) {
    return (
      <ContainerPage>
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Error al cargar la plantilla
          </h2>
          <p className="text-muted-foreground mb-4">
            No se pudo encontrar la plantilla solicitada
          </p>
          <button
            onClick={() => setLocation("/surveys/templates")}
            className="text-primary hover:underline"
          >
            Volver a plantillas
          </button>
        </div>
      </ContainerPage>
    );
  }

  return (
    <ContainerPage>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Plantilla</h1>
        <p className="text-muted-foreground">
          Modificar "{template.title}"
        </p>
      </div>

      <SurveyTemplateForm
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={updateTemplateMutation.isPending}
      />
    </ContainerPage>
  );
}
