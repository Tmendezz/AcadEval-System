import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { SurveyAudienceSelectorExpandable } from './survey-audience-selector-expandable';

import { TechnicalCareer } from '../hooks/use-surveys';
import { CareerYear } from '../models/survey-types';

export type SurveyAudience = 'students' | 'professors' | 'all';

export interface SurveySettingsFormProps {
  audience: SurveyAudience;
  isAnonymous: boolean;
  selectedCareerIds: string[];
  selectedYears: CareerYear[];
  onChange: (updates: { 
    audience?: SurveyAudience; 
    isAnonymous?: boolean;
    selectedCareerIds?: string[];
    selectedYears?: CareerYear[];
  }) => void;
  careers: TechnicalCareer[];
}

export function SurveySettingsForm({ 
  audience, 
  isAnonymous, 
  selectedCareerIds,
  selectedYears,
  onChange, 
  careers
}: SurveySettingsFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Tipo de audiencia</Label>
              <Select value={audience} onValueChange={(v: SurveyAudience) => onChange({ audience: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona audiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Estudiantes</SelectItem>
                  <SelectItem value="professors">Profesores</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="mb-1 block">Respuestas anónimas</Label>
                <p className="text-xs text-muted-foreground">Desactivar para recopilar email</p>
              </div>
              <Switch checked={isAnonymous} onCheckedChange={(checked) => onChange({ isAnonymous: checked })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <SurveyAudienceSelectorExpandable
        careers={careers}
        selectedCareerIds={selectedCareerIds}
        selectedYears={selectedYears}
        onCareerChange={(careerIds) => onChange({ selectedCareerIds: careerIds })}
        onYearChange={(years) => onChange({ selectedYears: years })}
      />
    </div>
  );
}


