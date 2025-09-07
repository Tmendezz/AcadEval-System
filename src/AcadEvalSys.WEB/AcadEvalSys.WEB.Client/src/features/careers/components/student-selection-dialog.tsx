import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { Users, Search, UserPlus, Filter, CheckCircle } from "lucide-react";
import { useAvailableStudents } from "../hooks";
import { Student } from "@infrastructure/api/types/student";
import { CareerYearLabels } from "@infrastructure/api/types/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as subjectService from "@infrastructure/api/clients/subject-service";
import { toast } from "sonner";

interface StudentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careerId: string;
  subjectId: string;
  subjectName: string;
}

export function StudentSelectionDialog({
  open,
  onOpenChange,
  careerId,
  subjectId,
  subjectName,
}: StudentSelectionDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<
    "First" | "Second" | "Third" | "All"
  >("All");

  const queryClient = useQueryClient();

  const { data: availableStudents, isLoading } = useAvailableStudents({
    careerId,
    subjectId,
    year: yearFilter === "All" ? undefined : yearFilter,
    enabled: open,
  });

  const enrollMutation = useMutation({
    mutationFn: async (studentIds: string[]) => {
      const promises = studentIds.map((studentId) =>
        subjectService.enrollStudent(careerId, subjectId, studentId)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success(
        `✅ ${selectedStudents.size} estudiantes inscritos exitosamente`
      );

      // Invalidar cache
      queryClient.invalidateQueries({
        queryKey: ["subject", subjectId, careerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-students", careerId, subjectId],
      });

      // Limpiar selección y cerrar modal
      setSelectedStudents(new Set());
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error enrolling students:", error);
      toast.error("❌ Error al inscribir estudiantes: " + error.message);
    },
  });

  const filteredStudents = useMemo(() => {
    if (!availableStudents) return [];

    return availableStudents.filter(
      (student: Student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableStudents, searchTerm]);

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
      setSelectedStudents(new Set(filteredStudents.map((s: Student) => s.id)));
    }
  };

  const handleEnrollSelected = () => {
    if (selectedStudents.size === 0) return;
    enrollMutation.mutate(Array.from(selectedStudents));
  };

  const handleClose = () => {
    setSelectedStudents(new Set());
    setSearchTerm("");
    setYearFilter("All");
    onOpenChange(false);
  };

  const renderYearFilters = () => (
    <div className="flex gap-2">
      {["All", "First", "Second", "Third"].map((year) => (
        <Button
          key={year}
          variant={yearFilter === year ? "default" : "outline"}
          size="sm"
          onClick={() =>
            setYearFilter(year as "All" | "First" | "Second" | "Third")
          }
        >
          {year === "All"
            ? "Todos"
            : `${
                year === "First" ? "1er" : year === "Second" ? "2do" : "3er"
              } año`}
        </Button>
      ))}
    </div>
  );

  const renderStudentCard = (student: Student) => {
    const isSelected = selectedStudents.has(student.id);

    return (
      <Card
        key={student.id}
        className={`cursor-pointer transition-colors ${
          isSelected ? "border-primary bg-primary/5" : "hover:bg-gray-50"
        }`}
        onClick={() => handleStudentToggle(student.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isSelected}
              onChange={() => handleStudentToggle(student.id)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
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
            {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Inscribir Estudiantes
          </DialogTitle>
          <DialogDescription>
            Selecciona estudiantes para inscribir en{" "}
            <strong>{subjectName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {/* Filtros y búsqueda */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filtrar por año:</span>
              {renderYearFilters()}
            </div>
          </div>

          {/* Controles de selección */}
          {!isLoading && filteredStudents.length > 0 && (
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
                <Badge variant="default">
                  {selectedStudents.size} seleccionado
                  {selectedStudents.size > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          )}

          {/* Lista de estudiantes */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <LoadingState message="Cargando estudiantes disponibles..." />
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {availableStudents?.length === 0
                    ? "No hay estudiantes disponibles para inscribir"
                    : "No se encontraron estudiantes con esos criterios"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map(renderStudentCard)}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleEnrollSelected}
            disabled={selectedStudents.size === 0 || enrollMutation.isPending}
          >
            {enrollMutation.isPending
              ? "Inscribiendo..."
              : `Inscribir ${selectedStudents.size} estudiante${
                  selectedStudents.size > 1 ? "s" : ""
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
