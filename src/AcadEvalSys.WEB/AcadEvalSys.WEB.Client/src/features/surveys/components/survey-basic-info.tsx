import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { SurveyTemplateType } from '../models/survey-template-types';

export interface SurveyBasicInfo {
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
}

interface SurveyBasicInfoProps {
  data: SurveyBasicInfo;
  onChange: (data: Partial<SurveyBasicInfo>) => void;
  errors?: Record<string, string>;
  showDraftToggle?: boolean;
  showSurveyType?: boolean;
}

export function SurveyBasicInfo({
  data,
  onChange,
  errors = {},
  showDraftToggle = true,
  showSurveyType = true,
}: SurveyBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ej: Evaluación de competencias técnicas"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe el propósito de esta encuesta..."
            className={errors.description ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {showSurveyType && (
            <div>
              <Label htmlFor="surveyType">Tipo de encuesta</Label>
              <Select
                value={data.surveyType.toString()}
                onValueChange={(value: string) => onChange({ 
                  surveyType: Number(value) as SurveyTemplateType 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SurveyTemplateType.Student.toString()}>
                    Para Estudiantes
                  </SelectItem>
                  <SelectItem value={SurveyTemplateType.Professor.toString()}>
                    Para Profesores
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {showDraftToggle && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isDraft"
                checked={data.isDraft}
                onCheckedChange={(checked: boolean) => onChange({ isDraft: checked })}
              />
              <Label htmlFor="isDraft">Guardar como borrador</Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
