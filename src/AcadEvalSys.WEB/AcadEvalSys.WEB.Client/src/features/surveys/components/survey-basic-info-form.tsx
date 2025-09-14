import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

export interface SurveyBasicInfoFormProps {
  title: string;
  description: string;
  onChange: (updates: { title?: string; description?: string }) => void;
  errors?: Record<string, string>;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
  // Si es true, adapta los textos para PLANTILLAS
  isTemplate?: boolean;
  // Si es true, deshabilita la edición del título
  isTitleDisabled?: boolean;
  // Si es true, deshabilita la edición de la descripción
  isDescriptionDisabled?: boolean;
  // Si es false, oculta el campo de descripción
  showDescription?: boolean;
}

export function SurveyBasicInfoForm({ 
  title, 
  description, 
  onChange, 
  errors,
  maxTitleLength = 120,
  maxDescriptionLength = 300,
  isTemplate = false,
  isTitleDisabled = false,
  isDescriptionDisabled = false,
  showDescription = true,
}: SurveyBasicInfoFormProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ description: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isTemplate ? 'Información Básica de la Plantilla' : 'Información Básica de la Encuesta'}</CardTitle>
      
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="mb-1 block">{isTemplate ? 'Título de la Plantilla *' : 'Título de la Encuesta *'}</Label>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder={isTemplate ? 'Ingresa el título de la plantilla' : 'Ingresa el título de la encuesta'}
            className={`${errors?.title ? 'border-destructive' : ''}`}
            maxLength={maxTitleLength}
            disabled={isTitleDisabled}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            {title.length}/{maxTitleLength}
          </div>
          {errors?.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {showDescription && (
          <div className="space-y-2">
            <Label htmlFor="description" className="mb-1 block">{isTemplate ? 'Descripción de la Plantilla' : 'Descripción'}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder={isTemplate ? 'Describe el propósito de la plantilla' : 'Describe el propósito de la encuesta'}
              rows={3}
              className={`${errors?.description ? 'border-destructive' : ''}`}
              maxLength={maxDescriptionLength}
              disabled={isDescriptionDisabled}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              {description.length}/{maxDescriptionLength}
            </div>
            {errors?.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
