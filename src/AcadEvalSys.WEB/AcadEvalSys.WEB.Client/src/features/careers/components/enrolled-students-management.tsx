import {
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";

import { Users, UserMinus, Trash2 } from "lucide-react";
import { Student } from "@/shared/types/student";
import { CareerYear, CareerYearLabels } from "@/shared/types/enums";
import { useUnenrollStudent, useUnenrollStudents } from "../hooks";

interface EnrolledStudentsManagementProps {
  enrolledStudents: Student[];
  subjectId: string;
  subjectName: string;
  careerId: string;
  isLoading?: boolean;
  onSelectionChange?: (state: {
    selectedCount: number;
    totalFiltered: number;
    isAllSelected: boolean;
    isBulkPending: boolean;
  }) => void;
}

export interface EnrolledStudentsManagementHandle {
  toggleSelectAll: () => void;
  unenrollSelected: () => Promise<void>;
  getSelectionState: () => {
    selectedCount: number;
    totalFiltered: number;
    isAllSelected: boolean;
    isBulkPending: boolean;
  };
}

export const EnrolledStudentsManagement = forwardRef<
  EnrolledStudentsManagementHandle,
  EnrolledStudentsManagementProps
>(function EnrolledStudentsManagement(
  {
    enrolledStudents,
    subjectId,
    subjectName,
    careerId,
    isLoading = false,
    onSelectionChange,
  }: EnrolledStudentsManagementProps,
  ref
) {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm] = useState("");
  const [yearFilter] = useState<CareerYear | "All">("All");

  const unenrollStudentMutation = useUnenrollStudent();
  const unenrollStudentsMutation = useUnenrollStudents();

  const filteredStudents = useMemo(() => {
    let filtered = enrolledStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (yearFilter !== "All") {
      filtered = filtered.filter(
        (student) => student.currentYear === yearFilter
      );
    }

    return filtered;
  }, [enrolledStudents, searchTerm, yearFilter]);

  const handleStudentToggle = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleUnenrollSingle = async (studentId: string) => {
    try {
      await unenrollStudentMutation.mutateAsync({
        careerId,
        subjectId,
        studentId,
      });
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleUnenrollSelected = async () => {
    if (selectedStudents.size === 0) return;

    try {
      await unenrollStudentsMutation.mutateAsync({
        careerId,
        subjectId,
        studentIds: Array.from(selectedStudents),
      });
      setSelectedStudents(new Set());
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  // Exponer API al padre
  useImperativeHandle(
    ref,
    () => ({
      toggleSelectAll: handleSelectAll,
      unenrollSelected: handleUnenrollSelected,
      getSelectionState: () => ({
        selectedCount: selectedStudents.size,
        totalFiltered: filteredStudents.length,
        isAllSelected:
          selectedStudents.size === filteredStudents.length &&
          filteredStudents.length > 0,
        isBulkPending: unenrollStudentsMutation.isPending,
      }),
    }),
    [
      selectedStudents,
      filteredStudents.length,
      unenrollStudentsMutation.isPending,
    ]
  );

  // Notificar cambios de selección al padre
  useEffect(() => {
    if (!onSelectionChange) return;
    onSelectionChange({
      selectedCount: selectedStudents.size,
      totalFiltered: filteredStudents.length,
      isAllSelected:
        selectedStudents.size === filteredStudents.length &&
        filteredStudents.length > 0,
      isBulkPending: unenrollStudentsMutation.isPending,
    });
  }, [
    selectedStudents,
    filteredStudents.length,
    unenrollStudentsMutation.isPending,
  ]);

  // Filtros por año disponibles si se requiere UI dedicada

  const renderStudentCard = (student: Student) => {
    const isSelected = selectedStudents.has(student.id);

    return (
      <Card key={student.id} className="relative">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleStudentToggle(student.id)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{student.name}</p>
                <Badge variant="outline">
                  {CareerYearLabels[student.currentYear]}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
            <ConfirmDialog
              title="Confirmar Desinscripción"
              description={`¿Estás seguro que deseas desinscribir a ${student.name} de ${subjectName}? Esta acción se puede revertir.`}
              confirmText="Desinscribir"
              cancelText="Cancelar"
              onConfirm={() => handleUnenrollSingle(student.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={unenrollStudentMutation.isPending}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estudiantes Inscriptos ({enrolledStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando estudiantes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estudiantes Inscriptos ({enrolledStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controles de selección */}
          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between py-2 border-y">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedStudents.size === filteredStudents.length
                    ? "Deseleccionar todo"
                    : "Seleccionar todo"}
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedStudents.size} de {filteredStudents.length}{" "}
                  estudiantes seleccionados
                </span>
              </div>
              {selectedStudents.size > 0 && (
                <ConfirmDialog
                  title="Confirmar Desinscripción Masiva"
                  description={`¿Estás seguro que deseas desinscribir a ${
                    selectedStudents.size
                  } estudiante${
                    selectedStudents.size > 1 ? "s" : ""
                  } de ${subjectName}? Esta acción se puede revertir.`}
                  confirmText="Desinscribir todos"
                  cancelText="Cancelar"
                  onConfirm={handleUnenrollSelected}
                  trigger={
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={unenrollStudentsMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Desinscribir {selectedStudents.size} estudiante
                      {selectedStudents.size > 1 ? "s" : ""}
                    </Button>
                  }
                />
              )}
            </div>
          )}

          {/* Lista de estudiantes */}
          <div className="space-y-2">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {enrolledStudents.length === 0
                    ? "No hay estudiantes inscritos en esta asignatura"
                    : "No se encontraron estudiantes con esos criterios"}
                </p>
              </div>
            ) : (
              filteredStudents.map(renderStudentCard)
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
});
