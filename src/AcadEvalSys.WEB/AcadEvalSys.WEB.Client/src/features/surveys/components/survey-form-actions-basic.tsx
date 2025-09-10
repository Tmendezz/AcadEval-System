import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface SurveyFormActionsBasicProps {
  onCancel: () => void;
  submitLabel: string;
  isLoading?: boolean;
  isDirty?: boolean;
  isValid?: boolean;
}

export function SurveyFormActionsBasic({ 
  onCancel, 
  submitLabel, 
  isLoading = false,
  isDirty = true,
  isValid = true,
}: SurveyFormActionsBasicProps) {
  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-3 border-t mt-6 flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading || !isDirty || !isValid}>
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
}
