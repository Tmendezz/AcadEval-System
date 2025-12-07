import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { formatDateForDisplay } from '@/shared/utils/date-utils';
import { DateTimePicker } from '@/shared/components/ui/date-time-picker';

export interface SurveySchedulingFormProps {
  publishAt?: string;
  closeAt?: string;
  onChange: (updates: { publishAt?: string; closeAt?: string }) => void;
  errors?: Record<string, string>;
}

export function SurveySchedulingForm({
  publishAt = '',
  closeAt = '',
  onChange,
  errors = {},
}: SurveySchedulingFormProps) {
  
  // Obtener fecha/hora actual para el mínimo
  const now = new Date();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programación de la Encuesta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Configure las fechas de publicación y cierre de la encuesta. Si la fecha de publicación ya pasó, la encuesta se publicará automáticamente.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <DateTimePicker
              id="publishAt"
              label="Fecha de Publicación"
              value={publishAt || null}
              onChange={(value) => onChange({ publishAt: value || undefined })}
              placeholder="Seleccionar fecha y hora de publicación"
              min={now}
              showTime={true}
              error={errors?.publishAt}
            />
            <p className="text-xs text-muted-foreground">
              La encuesta será visible para los usuarios a partir de esta fecha
            </p>
          </div>

          <div className="space-y-2">
            <DateTimePicker
              id="closeAt"
              label="Fecha de Cierre"
              value={closeAt || null}
              onChange={(value) => onChange({ closeAt: value || undefined })}
              placeholder="Seleccionar fecha y hora de cierre"
              min={publishAt ? new Date(publishAt) : now}
              showTime={true}
              error={errors?.closeAt}
            />
            <p className="text-xs text-muted-foreground">
              Los usuarios no podrán responder después de esta fecha
            </p>
          </div>
        </div>

        {publishAt && closeAt && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-2">Resumen de programación:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Se publica:</strong> {formatDateForDisplay(new Date(publishAt))}
              </p>
              <p>
                <strong>Se cierra:</strong> {formatDateForDisplay(new Date(closeAt))}
              </p>
              <p>
                <strong>Duración:</strong> {Math.ceil((new Date(closeAt).getTime() - new Date(publishAt).getTime()) / (1000 * 60 * 60 * 24))} días
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
