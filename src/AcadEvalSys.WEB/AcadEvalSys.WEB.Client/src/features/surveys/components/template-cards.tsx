import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useLocation } from 'wouter';
import { SurveyTemplateListItem } from '../models/survey-template-types';
import { useDeleteSurveyTemplate } from '../hooks/use-survey-templates';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';


interface TemplateCardsProps {
  templates: SurveyTemplateListItem[];
  onUseTemplate: (template: SurveyTemplateListItem) => void;
}

export function TemplateCards({ templates, onUseTemplate }: TemplateCardsProps) {
  const [, setLocation] = useLocation();
  const deleteTemplate = useDeleteSurveyTemplate();
  const [error, setError] = useState<unknown>(null);

  const handleDelete = async (template: SurveyTemplateListItem) => {
    try {
      await deleteTemplate.mutateAsync(template.id);
    } catch (error) {
      setError(error);
    }
  };


  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-2">{t.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  {t.surveyType === 'Student' ? 'Estudiantes' : 'Profesores'}
                </Badge>
                <span>{t.questionCount} preguntas</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{t.description}</p>
            </CardContent>
            <CardFooter className="justify-between">
              <ConfirmDialog
                title="¿Eliminar plantilla?"
                description={`¿Estás seguro de que quieres eliminar la plantilla "${t.title}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={() => handleDelete(t)}
                trigger={
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={deleteTemplate.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                }
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setLocation(`/plantillas/${t.id}/editar`)}>
                  Editar
                </Button>
                <Button onClick={() => onUseTemplate(t)}>Usar</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>


    </>
  );
}


