import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface SurveyFormActionsBasicProps {
  onCancel: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

export function SurveyFormActionsBasic({ 
  onCancel, 
  submitLabel, 
  isLoading = false 
}: SurveyFormActionsBasicProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
}
