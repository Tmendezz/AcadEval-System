import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ContainerPage } from "@/shared/components/container-page";
import { SurveyTemplateForm } from "../components/survey-template-form";
import { useCreateSurveyTemplate } from "../hooks/use-survey-templates";
import { useSurveyTemplateStore } from "../store/use-survey-template-store";
import {
  CreateSurveyTemplateRequest,
} from "@/shared/types";

export default function CreateTemplatePage() {
  const [, setLocation] = useLocation();
  const { resetForm } = useSurveyTemplateStore();
  const createTemplateMutation = useCreateSurveyTemplate();

  // Limpiar el formulario al entrar
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleSave = async (template: CreateSurveyTemplateRequest) => {
    try {
      await createTemplateMutation.mutateAsync(template);
      toast.success("Plantilla creada correctamente");
      resetForm();
      setLocation("/surveys/templates");
    } catch (error) {
      toast.error("Error al crear la plantilla");
      console.error("Error creating template:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setLocation("/surveys/templates");
  };

  return (
    <ContainerPage>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear Nueva Plantilla</h1>
        <p className="text-muted-foreground">
          Define las preguntas y configuración para una nueva plantilla de encuesta
        </p>
      </div>

      <SurveyTemplateForm
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={createTemplateMutation.isPending}
      />
    </ContainerPage>
  );
}
