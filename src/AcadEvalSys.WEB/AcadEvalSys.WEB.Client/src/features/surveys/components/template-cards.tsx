import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useLocation } from 'wouter';
import { SurveyTemplateListItem, SurveyTemplateType } from '../models/survey-template-types';

interface TemplateCardsProps {
  templates: SurveyTemplateListItem[];
  onUseTemplate: (template: SurveyTemplateListItem) => void;
}

export function TemplateCards({ templates, onUseTemplate }: TemplateCardsProps) {
  const [, setLocation] = useLocation();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((t) => (
        <Card key={t.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="line-clamp-2">{t.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">
                {t.surveyType === SurveyTemplateType.Student ? 'Estudiantes' : 'Profesores'}
              </Badge>
              <span>{t.questionCount} preguntas</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{t.description}</p>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => setLocation(`/templates/editar/${t.id}`)}>Editar</Button>
            <Button onClick={() => onUseTemplate(t)}>Usar</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}


