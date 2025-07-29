import { Button } from "@/shared/components/ui/button";
import { Upload } from "lucide-react";

interface ImportStudentsButtonProps {
  onImport: () => void;
  disabled?: boolean;
}

export function ImportStudentsButton({
  onImport,
  disabled = false,
}: ImportStudentsButtonProps) {
  return (
    <Button onClick={onImport} disabled={disabled} className="px-4 py-2">
      <Upload className="w-4 h-4 mr-2" />
      Importar Estudiantes
    </Button>
  );
}
