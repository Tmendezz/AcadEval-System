import { memo, useMemo, useCallback } from "react";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ProfessorCombobox } from "./professor-combobox";
import { Trash2, Plus } from "lucide-react";
import type { Subject } from "@/features/careers/models/subject";
import type { Professor } from "@/features/careers/models/professor";

type SubjectRow = Subject & { isNew?: boolean };

// Constante fuera del componente
const YEAR_LABELS: Record<string, string> = {
  First: "1° Año",
  Second: "2° Año",
  Third: "3° Año",
};

interface SubjectsYearSectionProps {
  year: "First" | "Second" | "Third";
  subjects: SubjectRow[];
  existingProfessors: Professor[];
  search: string;
  isSearching: boolean;
  onSearchChange: (search: string) => void;
  onSubjectNameChange: (subjectId: string, name: string) => void;
  onSubjectDescriptionChange?: (subjectId: string, description: string) => void;
  onSubjectProfessorChange: (subjectId: string, professorId: string) => void;
  onSubjectAdd?: (year: "First" | "Second" | "Third") => void;
  onSubjectDelete?: (subjectId: string) => void;
}

export const SubjectsYearSection = memo(function SubjectsYearSection({
  year,
  subjects,
  existingProfessors,
  search,
  isSearching,
  onSearchChange,
  onSubjectNameChange,
  onSubjectDescriptionChange,
  onSubjectProfessorChange,
  onSubjectAdd,
  onSubjectDelete,
}: SubjectsYearSectionProps) {
  const yearLabel = YEAR_LABELS[year];
  
  // Memoizar filtrado de asignaturas por año
  const yearSubjects = useMemo(
    () => subjects.filter((s) => s.year === year),
    [subjects, year]
  );

  // Memoizar opciones base de profesores
  const baseOptions = useMemo(
    () => existingProfessors.map((p) => ({ value: p.id, label: p.name })),
    [existingProfessors]
  );

  // Función para obtener opciones con profesor actual si no está en la lista
  const getProfessorOptions = useCallback(
    (subject: SubjectRow) => {
      if (
        subject.professorId &&
        !baseOptions.some((o) => o.value === subject.professorId)
      ) {
        return [
          { value: subject.professorId, label: subject.professorName || "Profesor asignado" },
          ...baseOptions,
        ];
      }
      return baseOptions;
    },
    [baseOptions]
  );

  // Handler memoizado para agregar asignatura
  const handleAddSubject = useCallback(() => {
    onSubjectAdd?.(year);
  }, [onSubjectAdd, year]);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{yearLabel}</span>
        {onSubjectAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSubject}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar asignatura
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {yearSubjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay asignaturas para {yearLabel.toLowerCase()}
          </div>
        ) : (
          yearSubjects.map((subject) => (
            <div
              key={subject.id}
              className="space-y-4 p-4 border border-gray-200 rounded-lg"
            >
              {/* Header con nombre y badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">
                    {subject.name || "Nueva asignatura"}
                  </h4>
                  {subject.isNew && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Nueva
                    </span>
                  )}
                </div>
                {onSubjectDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onSubjectDelete(subject.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Campos de entrada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Nombre:
                  </label>
                  <Input
                    value={subject.name}
                    onChange={(e) =>
                      onSubjectNameChange(subject.id, e.target.value)
                    }
                    placeholder="Nombre de la asignatura"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Profesor:
                  </label>
                  <ProfessorCombobox
                    value={subject.professorId}
                    onChange={(v) => {
                      if (!v) return;
                      onSubjectProfessorChange(subject.id, v);
                    }}
                    options={getProfessorOptions(subject)}
                    onSearch={onSearchChange}
                    isLoading={isSearching}
                    searchTerm={search}
                    placeholder="Seleccionar profesor"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Descripción:
                </label>
                <Input
                  value={subject.description}
                  onChange={(e) =>
                    onSubjectDescriptionChange?.(subject.id, e.target.value)
                  }
                  placeholder="Descripción de la asignatura"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
});
