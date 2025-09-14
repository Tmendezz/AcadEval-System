import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Trash2 } from 'lucide-react';

interface QuestionOptionRowProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder?: string;
  isReadOnly?: boolean;
}

export function QuestionOptionRow({ value, onChange, onRemove, placeholder, isReadOnly = false }: QuestionOptionRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={isReadOnly}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-600 hover:text-red-700"
        aria-label="Eliminar opción"
        disabled={isReadOnly}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


