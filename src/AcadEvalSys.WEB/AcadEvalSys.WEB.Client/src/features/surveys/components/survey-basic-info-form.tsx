import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

export interface SurveyBasicInfoFormProps {
  title: string;
  description: string;
  onChange: (updates: { title?: string; description?: string }) => void;
  errors?: Record<string, string>;
}

export function SurveyBasicInfoForm({ 
  title, 
  description, 
  onChange, 
  errors 
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
        <CardTitle>Información Básica de la Encuesta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título de la Encuesta *</Label>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Ingresa el título de la encuesta"
            className={errors?.title ? 'border-destructive' : ''}
          />
          {errors?.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe el propósito de la encuesta"
            rows={3}
            className={errors?.description ? 'border-destructive' : ''}
          />
          {errors?.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
