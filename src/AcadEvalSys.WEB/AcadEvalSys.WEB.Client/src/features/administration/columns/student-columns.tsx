import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Edit } from "lucide-react";
import { Student } from "../services/student-service";
import { TruncatedText } from "@/shared/components/ui/truncated-text";
import { DeleteButtonWithConfirm } from "@/shared/components/ui/delete-button-with-confirm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

// Constante fuera de la función para evitar recreación
const YEAR_LABELS: Record<number, string> = {
  1: "Primer Año",
  2: "Segundo Año",
  3: "Tercer Año",
};

interface StudentColumnsProps {
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onChangePassword: (student: Student, newPassword: string) => Promise<void>;
}

export const studentColumns = ({
  onEdit,
  onDelete,
}: Omit<StudentColumnsProps, "onChangePassword">): ColumnDef<Student>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    size: 180,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-primary">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <TruncatedText text={student.name} maxLength={20} className="font-medium text-xs" />
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 200,
    cell: ({ row }) => (
      <TruncatedText text={row.original.email} maxLength={30} className="text-xs" />
    ),
  },
  {
    accessorKey: "technicalCareerName",
    header: "Carrera",
    size: 150,
    cell: ({ row }) => {
      const career = row.getValue("technicalCareerName") as string;
      return (
        <TruncatedText text={career} maxLength={20}>
          <Badge variant="outline" className="text-xs">
            {career}
          </Badge>
        </TruncatedText>
      );
    },
  },
  {
    accessorKey: "currentYear",
    header: "Año",
    size: 100,
    cell: ({ row }) => {
      const year = row.getValue("currentYear") as number;
      return (
        <Badge variant="secondary" className="text-xs">
          {YEAR_LABELS[year] || `Año ${year}`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    size: 80,
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    size: 100,
    cell: ({ row }) => {
      const student = row.original;

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onEdit(student)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
            <DeleteButtonWithConfirm
              title="¿Estás seguro?"
              description={`Esta acción no se puede deshacer. ¿Desea eliminar al estudiante ${student.name}?`}
              confirmText="Confirmar"
              cancelText="Cancelar"
              onConfirm={() => onDelete(student)}
            />
          </TooltipProvider>
        </div>
      );
    },
  },
];
