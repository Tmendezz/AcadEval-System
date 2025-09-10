import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export type SurveyAudience = 'students' | 'professors' | 'all';

export interface SurveySettingsFormProps {
  audience: SurveyAudience;
  isAnonymous: boolean;
  onChange: (updates: { audience?: SurveyAudience; isAnonymous?: boolean }) => void;
}

export function SurveySettingsForm({ audience, isAnonymous, onChange }: SurveySettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">Audiencia</Label>
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
  );
}


