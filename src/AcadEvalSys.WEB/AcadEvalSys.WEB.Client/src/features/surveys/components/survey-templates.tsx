import { useState } from 'react';
import { TemplateList } from './template-list';
import { TemplatePreview } from './template-preview';
import { SurveyTemplateListItem } from '../models/survey-template-types';

export function SurveyTemplates() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplateListItem | null>(null);

  const handlePreview = (template: SurveyTemplateListItem) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedTemplate(null);
  };

  return (
    <>
      <TemplateList onPreview={handlePreview} />

      <TemplatePreview
        template={selectedTemplate as any} // TODO: Cargar template completo
        isOpen={showPreview}
        onClose={handleClosePreview}
      />
    </>
  );
}
