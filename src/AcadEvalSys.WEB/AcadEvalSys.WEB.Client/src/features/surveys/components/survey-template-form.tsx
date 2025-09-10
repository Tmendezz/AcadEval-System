import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Separator } from "@/shared/components/ui/separator";
import {
  SurveyTemplateType,
  QuestionType,
  SurveyTemplateTypeLabels,
  QuestionTypeLabels,
  CreateSurveyTemplateQuestionRequest,
  CreateSurveyTemplateQuestionOptionRequest,
} from "@/shared/types";
import { useSurveyTemplateStore } from "../store/use-survey-template-store";

// Schema para validación del formulario básico
const templateBasicSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  surveyType: z.nativeEnum(SurveyTemplateType),
  isDraft: z.boolean(),
});

type TemplateBasicForm = z.infer<typeof templateBasicSchema>;

interface SurveyTemplateFormProps {
  onSave: (template: {
    title: string;
    description: string;
    surveyType: SurveyTemplateType;
    isDraft: boolean;
    questions: CreateSurveyTemplateQuestionRequest[];
  }) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const SurveyTemplateForm = ({ onSave, onCancel, isSaving }: SurveyTemplateFormProps) => {
  const {
    title,
    description,
    surveyType,
    isDraft,
    questions,
    setBasicInfo,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
  } = useSurveyTemplateStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TemplateBasicForm>({
    resolver: zodResolver(templateBasicSchema),
    defaultValues: {
      title,
      description,
      surveyType,
      isDraft,
    },
  });

  // Sincronizar valores del store con el form cuando el store cambia
  useEffect(() => {
    setValue("title", title);
    setValue("description", description);
    setValue("surveyType", surveyType);
    setValue("isDraft", isDraft);
  }, [title, description, surveyType, isDraft, setValue]);

  const handleFieldChange = (field: keyof TemplateBasicForm, value: any) => {
    setValue(field, value);
    setBasicInfo({ 
      title: field === "title" ? value : title,
      description: field === "description" ? value : description,
      surveyType: field === "surveyType" ? value : surveyType,
      isDraft: field === "isDraft" ? value : isDraft,
    });
  };

  const handleFormSubmit = () => {
    onSave({
      title,
      description,
      surveyType,
      isDraft,
      questions,
    });
  };

  const handleAddQuestion = () => {
    const newQuestion: CreateSurveyTemplateQuestionRequest = {
      text: "",
      type: QuestionType.Text,
      isRequired: true,
      order: questions.length + 1,
    };
    addQuestion(newQuestion);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register("title", {
                  onChange: (e) => handleFieldChange("title", e.target.value)
                })}
                placeholder="Nombre de la plantilla"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surveyType">Tipo de Encuesta *</Label>
              <Select
                value={surveyType}
                onValueChange={(value: SurveyTemplateType) => handleFieldChange("surveyType", value)}
              >
                <SelectTrigger className={errors.surveyType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SurveyTemplateTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.surveyType && (
                <p className="text-sm text-destructive">{errors.surveyType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              {...register("description", {
                onChange: (e) => handleFieldChange("description", e.target.value)
              })}
              placeholder="Describe el propósito de esta plantilla"
              rows={3}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDraft"
              checked={isDraft}
              onCheckedChange={(checked) => handleFieldChange("isDraft", checked as boolean)}
            />
            <Label htmlFor="isDraft">Guardar como borrador</Label>
          </div>
        </CardContent>
      </Card>

      {/* Preguntas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Preguntas ({questions.length})</CardTitle>
            <Button onClick={handleAddQuestion} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Pregunta
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">No hay preguntas agregadas</p>
              <Button onClick={handleAddQuestion} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Primera Pregunta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={index}
                  question={question}
                  index={index}
                  onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                  onRemove={() => removeQuestion(index)}
                  onMoveUp={() => index > 0 && reorderQuestions(index, index - 1)}
                  onMoveDown={() => index < questions.length - 1 && reorderQuestions(index, index + 1)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex items-center justify-end space-x-4 pb-6">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleFormSubmit)} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar Plantilla"}
        </Button>
      </div>
    </div>
  );
};

interface QuestionCardProps {
  question: CreateSurveyTemplateQuestionRequest;
  index: number;
  onUpdate: (question: CreateSurveyTemplateQuestionRequest) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const QuestionCard = ({ question, index, onUpdate, onRemove, onMoveUp, onMoveDown }: QuestionCardProps) => {
  const [localQuestion, setLocalQuestion] = useState(question);

  // Sincronizar con prop question cuando cambia desde el padre
  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  // Función para actualizar y propagar cambios
  const handleQuestionUpdate = (updatedQuestion: CreateSurveyTemplateQuestionRequest) => {
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleAddOption = () => {
    const newOption: CreateSurveyTemplateQuestionOptionRequest = {
      text: "",
      value: (localQuestion.options?.length || 0) + 1,
      order: (localQuestion.options?.length || 0) + 1,
    };
    handleQuestionUpdate({
      ...localQuestion,
      options: [...(localQuestion.options || []), newOption],
    });
  };

  const handleRemoveOption = (optionIndex: number) => {
    const updatedOptions = localQuestion.options?.filter((_, i) => i !== optionIndex) || [];
    handleQuestionUpdate({
      ...localQuestion,
      options: updatedOptions,
    });
  };

  const handleUpdateOption = (optionIndex: number, field: keyof CreateSurveyTemplateQuestionOptionRequest, value: string | number) => {
    const updatedOptions = [...(localQuestion.options || [])];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value,
    };
    handleQuestionUpdate({
      ...localQuestion,
      options: updatedOptions,
    });
  };

  const needsOptions = localQuestion.type === QuestionType.MultipleChoice;
  const needsScale = localQuestion.type === QuestionType.Scale;

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-2 flex-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Pregunta {index + 1}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={index === 0}>
            ↑
          </Button>
          <Button variant="ghost" size="sm" onClick={onMoveDown}>
            ↓
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Texto de la pregunta *</Label>
            <Textarea
              value={localQuestion.text}
              onChange={(e) => handleQuestionUpdate({ ...localQuestion, text: e.target.value })}
              placeholder="Escribe tu pregunta aquí..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de pregunta</Label>
            <Select
              value={localQuestion.type}
              onValueChange={(value: QuestionType) =>
                handleQuestionUpdate({ ...localQuestion, type: value, options: undefined })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QuestionTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localQuestion.isRequired}
            onCheckedChange={(checked) =>
              handleQuestionUpdate({ ...localQuestion, isRequired: checked as boolean })
            }
          />
          <Label>Pregunta obligatoria</Label>
        </div>

        {needsOptions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opciones</Label>
              <Button variant="outline" size="sm" onClick={handleAddOption}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Opción
              </Button>
            </div>
            <div className="space-y-2">
              {localQuestion.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Input
                    placeholder="Texto de la opción"
                    value={option.text}
                    onChange={(e) => handleUpdateOption(optionIndex, "text", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Valor"
                    value={option.value}
                    onChange={(e) => handleUpdateOption(optionIndex, "value", parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(optionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {needsScale && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor mínimo</Label>
              <Input
                type="number"
                value={localQuestion.scaleMin || 1}
                onChange={(e) =>
                  handleQuestionUpdate({ ...localQuestion, scaleMin: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Valor máximo</Label>
              <Input
                type="number"
                value={localQuestion.scaleMax || 5}
                onChange={(e) =>
                  handleQuestionUpdate({ ...localQuestion, scaleMax: parseInt(e.target.value) || 5 })
                }
              />
            </div>
          </div>
        )}

        <Separator />
      </CardContent>
    </Card>
  );
};
