import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { ProfessorCombobox } from "@/shared/components/ui/professor-combobox";
import type { Subject } from "@/shared/types/subject";
import type { Professor } from "@/shared/types/professor";

interface SubjectRow extends Subject {}

interface SubjectsYearSectionProps {
  year: "First" | "Second" | "Third";
  subjects: SubjectRow[];
  existingProfessors: Professor[];
  search: string;
  isSearching: boolean;
  onSearchChange: (search: string) => void;
  onSubjectNameChange: (subjectId: string, name: string) => void;
  onSubjectProfessorChange: (subjectId: string, professorId: string) => void;
}

export function SubjectsYearSection({
  year,
  subjects,
  existingProfessors,
  search,
  isSearching,
  onSearchChange,
  onSubjectNameChange,
  onSubjectProfessorChange,
}: SubjectsYearSectionProps) {
  const yearLabel =
    year === "First" ? "1° Año" : year === "Second" ? "2° Año" : "3° Año";
  const yearSubjects = subjects.filter((s) => s.year === year);

  const getProfessorOptions = (subject: SubjectRow) => {
    const opts = existingProfessors.map((p) => ({
      value: p.id,
      label: `${p.name}`,
    }));

    if (
      subject.professorId &&
      !opts.some((o) => o.value === subject.professorId)
    ) {
      opts.unshift({
        value: subject.professorId,
        label: subject.professorName || "Profesor asignado",
      });
    }

    return opts;
  };

  return (
    <Card className="p-4 space-y-3">
      <span className="font-semibold">{yearLabel}</span>
      <div className="space-y-4">
        {yearSubjects.map((subject) => (
          <div
            key={subject.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Asignatura:
              </label>
              <Input
                value={subject.name}
                onChange={(e) =>
                  onSubjectNameChange(subject.id, e.target.value)
                }
                placeholder="Nombre de la asignatura"
              />
            </div>

            <div className="md:col-span-7">
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
        ))}
      </div>
    </Card>
  );
}
