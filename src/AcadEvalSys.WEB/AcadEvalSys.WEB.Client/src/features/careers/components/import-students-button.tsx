import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { UserPlus } from "lucide-react";
import { StudentSelectionDialog } from "./student-selection-dialog";

interface ImportStudentsButtonProps {
  careerId: string;
  subjectId: string;
  subjectName: string;
  disabled?: boolean;
}

export function ImportStudentsButton({
  careerId,
  subjectId,
  subjectName,
  disabled = false,
}: ImportStudentsButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        className="px-4 py-2"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Inscribir Alumnos
      </Button>

      <StudentSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        careerId={careerId}
        subjectId={subjectId}
        subjectName={subjectName}
      />
    </>
  );
}
