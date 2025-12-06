import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface SurveyFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  showSubmit?: boolean;
}

export function SurveyFormActions({
  onCancel,
  onSubmit,
  isLoading = false,
  submitText = "Guardar",
  cancelText = "Cancelar",
  showCancel = true,
  showSubmit = true,
}: SurveyFormActionsProps) {
  return (
    <div className="flex justify-between">
      {showCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {cancelText}
        </Button>
      )}
      {showSubmit && (
        <Button type="submit" onClick={onSubmit} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Guardando...' : submitText}
        </Button>
      )}
    </div>
  );
}
