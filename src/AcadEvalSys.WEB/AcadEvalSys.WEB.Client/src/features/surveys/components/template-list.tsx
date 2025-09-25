import { useState } from 'react';
import { useLocation } from 'wouter';
import { DataSection } from '@/shared/components/ui/data-section';

import { Card, CardContent } from '@/shared/components/ui/card';
import { useSurveyTemplates } from '../hooks/use-survey-templates';
import { useDeleteSurveyTemplate, useDuplicateSurveyTemplate } from '../hooks/use-survey-templates';
import { SurveyTemplateListItem, SurveyTemplateType } from '../models/survey-template-types';
import { getTemplateColumns } from './columns/template-columns';

interface TemplateListProps {
  onPreview: (template: SurveyTemplateListItem) => void;
}

export function TemplateList({ onPreview }: TemplateListProps) {
  const [, setLocation] = useLocation();
  const [filters] = useState({
    searchTerm: '',
    surveyType: undefined as SurveyTemplateType | undefined,
    isDraft: undefined as boolean | undefined,
  });

  const { data: templates = [], isLoading, error } = useSurveyTemplates(filters);
  const deleteTemplate = useDeleteSurveyTemplate();
  const duplicateTemplate = useDuplicateSurveyTemplate();

  // Handlers de filtros y crear se habilitarán cuando se agregue la UI

  const handleEdit = (template: SurveyTemplateListItem) => {
    setLocation(`/plantillas/${template.id}/editar`);
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

  const columns = getTemplateColumns({
    onPreview,
    onEdit: handleEdit,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
  });

  const tableData = isLoading || error ? [] : templates;

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
    <DataSection
      data={tableData}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No se encontraron plantillas."
      onRowClick={(id: string) => {
        const template = templates.find((t) => t.id === id);
        if (template) {
          onPreview(template);
        }
      }}
    />
  );
}
