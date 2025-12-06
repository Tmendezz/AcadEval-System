import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { UserPlus } from "lucide-react";
import { AddStudentDialog } from "./add-student-dialog";

interface AddStudentButtonProps {
  careerId: string;
  careerName: string;
  disabled?: boolean;
}

export function AddStudentButton({
  careerId,
  careerName,
  disabled = false,
}: AddStudentButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        variant="outline"
        className="px-4 py-2"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Agregar Estudiante
      </Button>

      <AddStudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        careerId={careerId}
        careerName={careerName}
      />
    </>
  );
}
