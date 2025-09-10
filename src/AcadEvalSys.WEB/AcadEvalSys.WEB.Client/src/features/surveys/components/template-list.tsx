import { useState } from 'react';
import { useLocation } from 'wouter';
import { Plus, Search, MoreHorizontal, Edit, Copy, Trash2, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useSurveyTemplates } from '../hooks/use-survey-templates';
import { useDeleteSurveyTemplate, useDuplicateSurveyTemplate } from '../hooks/use-survey-templates';
import { SurveyTemplateListItem, SurveyTemplateType } from '../models/survey-template-types';
import { getSurveyTemplateTypeLabel, getSurveyTemplateStatusLabel } from '../models/survey-template-types';

interface TemplateListProps {
  onPreview: (template: SurveyTemplateListItem) => void;
}

export function TemplateList({ onPreview }: TemplateListProps) {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    searchTerm: '',
    surveyType: undefined as SurveyTemplateType | undefined,
    isDraft: undefined as boolean | undefined,
  });

  const { data: templates = [], isLoading, error } = useSurveyTemplates(filters);
  const deleteTemplate = useDeleteSurveyTemplate();
  const duplicateTemplate = useDuplicateSurveyTemplate();

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  const handleTypeFilter = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      surveyType: value === 'all' ? undefined : Number(value) as SurveyTemplateType 
    }));
  };

  const handleDraftFilter = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      isDraft: value === 'all' ? undefined : value === 'draft' 
    }));
  };

  const handleCreate = () => {
    setLocation('/templates/crear');
  };

  const handleEdit = (template: SurveyTemplateListItem) => {
    setLocation(`/templates/editar/${template.id}`);
  };

  const handleDuplicate = async (template: SurveyTemplateListItem) => {
    const newName = `${template.title} (Copia)`;
    await duplicateTemplate.mutateAsync({ id: template.id, newName });
  };

  const handleDelete = async (template: SurveyTemplateListItem) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la plantilla "${template.title}"?`)) {
      await deleteTemplate.mutateAsync(template.id);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error al cargar las plantillas. Inténtalo de nuevo.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Preguntas</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando plantillas...
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron plantillas
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getSurveyTemplateTypeLabel(template.surveyType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.isDraft ? 'secondary' : 'default'}>
                        {getSurveyTemplateStatusLabel(template.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{template.questionCount}</TableCell>
                    <TableCell>v{template.version}</TableCell>
                    <TableCell>
                      {new Date(template.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onPreview(template)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(template)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(template)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
