import { useLocation, useParams } from "wouter";
import { Edit, ArrowLeft } from "lucide-react";
import { ContainerPage } from "@/shared/components/container-page";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { useSurveyTemplate } from "../hooks/use-survey-templates";
import {
  SurveyTemplateTypeLabels,
  QuestionTypeLabels,
  QuestionType,
} from "@/shared/types";

export default function ViewTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  
  const { data: template, isLoading, error } = useSurveyTemplate(id!);

  const handleEdit = () => {
    setLocation(`/surveys/templates/${id}/edit`);
  };

  const handleBack = () => {
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
          <Button variant="outline" onClick={handleBack}>
            Volver a plantillas
          </Button>
        </div>
      </ContainerPage>
    );
  }

  return (
    <ContainerPage>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{template.title}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Plantilla</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Encuesta</p>
                <p className="text-sm">{SurveyTemplateTypeLabels[template.surveyType]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge variant={template.isDraft ? "secondary" : "default"}>
                  {template.isDraft ? "Borrador" : "Publicado"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preguntas</p>
                <p className="text-sm">{template.questions.length} preguntas</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Creado:</span> {new Date(template.createdAt).toLocaleString('es-ES')}
              </div>
              <div>
                <span className="font-medium">Modificado:</span> {new Date(template.updatedAt).toLocaleString('es-ES')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preguntas */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas ({template.questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {template.questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Esta plantilla no tiene preguntas configuradas</p>
              </div>
            ) : (
              <div className="space-y-6">
                {template.questions
                  .sort((a, b) => a.order - b.order)
                  .map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Pregunta {index + 1}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {QuestionTypeLabels[question.type]}
                            </Badge>
                            {question.isRequired && (
                              <Badge variant="destructive" className="text-xs">
                                Obligatoria
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium mb-2">{question.text}</p>
                        </div>
                      </div>

                      {/* Opciones para preguntas de opción múltiple */}
                      {question.type === QuestionType.MultipleChoice && question.options && (
                        <div className="ml-4 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Opciones:</p>
                          <ul className="space-y-1">
                            {question.options
                              .sort((a, b) => a.order - b.order)
                              .map((option, optionIndex) => (
                                <li key={option.id} className="text-sm flex items-center space-x-2">
                                  <span className="text-muted-foreground">{optionIndex + 1}.</span>
                                  <span>{option.text}</span>
                                  <span className="text-xs text-muted-foreground">(valor: {option.value})</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {/* Configuración de escala */}
                      {question.type === QuestionType.Scale && (
                        <div className="ml-4 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Configuración de Escala:</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span>Mínimo: {question.scaleMin || 1}</span>
                            <span>Máximo: {question.scaleMax || 5}</span>
                          </div>
                          {question.scaleLabels && question.scaleLabels.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Etiquetas:</p>
                              <div className="flex space-x-2 text-xs">
                                {question.scaleLabels.map((label, labelIndex) => (
                                  <span key={labelIndex} className="bg-muted px-2 py-1 rounded">
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {index < template.questions.length - 1 && <Separator />}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContainerPage>
  );
}
