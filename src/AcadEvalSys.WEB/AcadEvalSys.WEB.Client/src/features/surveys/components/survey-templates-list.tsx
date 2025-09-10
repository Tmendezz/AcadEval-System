import { Plus, Eye, Edit, Trash2, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { useSurveyTemplates } from "../hooks/use-survey-templates";
import {
  SurveyTemplate,
  SurveyTemplateType,
  SurveyTemplateTypeLabels,
  SurveyTemplatesFilters,
} from "@/shared/types";

interface SurveyTemplatesListProps {
  filters: SurveyTemplatesFilters;
  onFiltersChange: (filters: SurveyTemplatesFilters) => void;
  onView: (template: SurveyTemplate) => void;
  onEdit: (template: SurveyTemplate) => void;
  onDelete: (template: SurveyTemplate) => void;
  onCreate: () => void;
}

export const SurveyTemplatesList = ({
  filters,
  onFiltersChange,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: SurveyTemplatesListProps) => {
  const { data: templates, isLoading, error } = useSurveyTemplates(filters);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value || undefined });
  };

  const handleTypeChange = (value: string) => {
    const surveyType = value === "all" ? undefined : (value as SurveyTemplateType);
    onFiltersChange({ ...filters, surveyType });
  };

  const handleDraftChange = (value: string) => {
    const isDraft = value === "all" ? undefined : value === "draft";
    onFiltersChange({ ...filters, isDraft });
  };

  if (isLoading) {
    return <LoadingState message="Cargando plantillas..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-destructive">Error al cargar las plantillas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros y botón crear */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plantillas de Encuestas</h1>
          <p className="text-muted-foreground">
            Gestiona las plantillas para las encuestas académicas
          </p>
        </div>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            value={filters.searchTerm || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.surveyType || "all"} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tipo de encuesta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {Object.entries(SurveyTemplateTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.isDraft === undefined ? "all" : filters.isDraft ? "draft" : "published"} 
          onValueChange={handleDraftChange}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de plantillas */}
      {!templates || templates.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No se encontraron plantillas</p>
              <Button variant="outline" onClick={onCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primera plantilla
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <SurveyTemplateCard
              key={template.id}
              template={template}
              onView={() => onView(template)}
              onEdit={() => onEdit(template)}
              onDelete={() => onDelete(template)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SurveyTemplateCardProps {
  template: SurveyTemplate;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SurveyTemplateCard = ({ template, onView, onEdit, onDelete }: SurveyTemplateCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{template.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {template.description}
            </CardDescription>
          </div>
          <Badge variant={template.isDraft ? "secondary" : "default"}>
            {template.isDraft ? "Borrador" : "Publicado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{SurveyTemplateTypeLabels[template.surveyType]}</span>
          <span>{template.questions.length} preguntas</span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
