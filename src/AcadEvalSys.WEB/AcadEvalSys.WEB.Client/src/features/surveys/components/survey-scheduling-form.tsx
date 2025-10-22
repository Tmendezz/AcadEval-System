import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { formatDateForDisplay } from '@/shared/utils/date-utils';

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
  
  const handlePublishAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ publishAt: e.target.value });
  };

  const handleCloseAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ closeAt: e.target.value });
  };

  // Obtener fecha/hora actual para el mínimo
  const now = new Date();
  const currentDateTime = now.toISOString().slice(0, 16); // formato YYYY-MM-DDTHH:mm

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
            <Label htmlFor="publishAt" className="mb-1 block">
              Fecha de Publicación
            </Label>
            <Input
              id="publishAt"
              type="datetime-local"
              value={publishAt}
              onChange={handlePublishAtChange}
              min={currentDateTime}
              className={`${errors?.publishAt ? 'border-destructive' : ''}`}
            />
            <p className="text-xs text-muted-foreground">
              La encuesta será visible para los usuarios a partir de esta fecha
            </p>
            {errors?.publishAt && (
              <p className="text-sm text-destructive">{errors.publishAt}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="closeAt" className="mb-1 block">
              Fecha de Cierre
            </Label>
            <Input
              id="closeAt"
              type="datetime-local"
              value={closeAt}
              onChange={handleCloseAtChange}
              min={publishAt || currentDateTime}
              className={`${errors?.closeAt ? 'border-destructive' : ''}`}
            />
            <p className="text-xs text-muted-foreground">
              Los usuarios no podrán responder después de esta fecha
            </p>
            {errors?.closeAt && (
              <p className="text-sm text-destructive">{errors.closeAt}</p>
            )}
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
