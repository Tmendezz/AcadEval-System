import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Upload } from "lucide-react";
import { ImportStudentsToCareerDialog } from "./import-students-to-career-dialog";

interface ImportStudentsToCareerButtonProps {
  careerId: string;
  careerName: string;
  disabled?: boolean;
}

export function ImportStudentsToCareerButton({
  careerId,
  careerName,
  disabled = false,
}: ImportStudentsToCareerButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        className="px-4 py-2"
      >
        <Upload className="w-4 h-4 mr-2" />
        Importar Estudiantes
      </Button>

      <ImportStudentsToCareerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        careerId={careerId}
        careerName={careerName}
      />
    </>
  );
}
