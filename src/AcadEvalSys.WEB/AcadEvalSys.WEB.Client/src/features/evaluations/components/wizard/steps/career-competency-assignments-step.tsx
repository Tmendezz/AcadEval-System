import { useState, useMemo, useCallback, useEffect } from "react";
import { Assignment } from "../../../models/evaluation-form";
import { useTechnicalCareers } from "@/shared/hooks/use-technical-careers";
import { useSubjectsByCareer } from "@/shared/hooks/use-subjects";
import { useCompetencies } from "@/features/competencies/hooks/use-competencies";
import {
  getAssignmentsForCareerAndYear,
  formatAssignmentCount,
} from "../../../utils/wizard-utils";
import { CareerCard } from "../components/career-card";
import { YearSection } from "../components/year-section";
import { AssignmentForm } from "../components/assignment-form";
import {
  buildExclusionSet,
  filterOptionsById,
} from "@shared/utils/unique-options";
import { SmartSelect } from "@/shared/components/ui/smart-select";

interface CareerCompetencyAssignmentsStepProps {
  assignments: Assignment[];
  onAssignmentsChange: (assignments: Assignment[]) => void;
  selectedCareers: Set<string>;
  expandedCareers: Set<string>;
  expandedYears: Set<string>;
  onSelectedCareersChange: (careers: Set<string>) => void;
  onExpandedCareersChange: (careers: Set<string>) => void;
  onExpandedYearsChange: (years: Set<string>) => void;
}

export function CareerCompetencyAssignmentsStep({
  assignments,
  onAssignmentsChange,
  selectedCareers,
  expandedCareers,
  expandedYears,
  onSelectedCareersChange,
  onExpandedCareersChange,
  onExpandedYearsChange,
}: CareerCompetencyAssignmentsStepProps) {
  const [careerToAdd, setCareerToAdd] = useState<string>("");

  // Obtener datos del backend
  const { data: careers = [], isLoading: careersLoading } =
    useTechnicalCareers();
  const { data: competencies = [], isLoading: competenciesLoading } =
    useCompetencies();

  // Inicializar carreras seleccionadas desde las asignaciones existentes
  useEffect(() => {
    const careerIdsFromAssignments = new Set(
      assignments.filter((a) => a.careerId).map((a) => a.careerId!)
    );
    if (careerIdsFromAssignments.size > 0 && selectedCareers.size === 0) {
      onSelectedCareersChange(careerIdsFromAssignments);
    }
  }, [assignments, selectedCareers.size, onSelectedCareersChange]);

  // carreras disponibles para agregar (excluyendo las ya seleccionadas)
  const availableCareers = useMemo(
    () => careers.filter((c) => !selectedCareers.has(c.id)),
    [careers, selectedCareers]
  );

  // Memoizar el conteo de asignaciones
  const assignmentCountText = useMemo(
    () => formatAssignmentCount(assignments.length),
    [assignments.length]
  );

  // Memoizar las carreras seleccionadas filtradas
  const selectedCareersList = useMemo(
    () => careers.filter((c) => selectedCareers.has(c.id)),
    [careers, selectedCareers]
  );

  const toggleCareer = useCallback((careerId: string) => {
    const newExpanded = new Set(expandedCareers);
    if (newExpanded.has(careerId)) {
      newExpanded.delete(careerId);
    } else {
      newExpanded.add(careerId);
    }
    onExpandedCareersChange(newExpanded);
  }, [expandedCareers, onExpandedCareersChange]);

  const addCareer = useCallback(
    (careerId: string) => {
      if (!careerId) return;
      const newSet = new Set(selectedCareers);
      newSet.add(careerId);
      onSelectedCareersChange(newSet);
      setCareerToAdd("");
      // expandir automáticamente
      const newExpanded = new Set(expandedCareers);
      newExpanded.add(careerId);
      onExpandedCareersChange(newExpanded);
    },
    [selectedCareers, expandedCareers, onSelectedCareersChange, onExpandedCareersChange]
  );

  const removeCareer = useCallback(
    (careerId: string) => {
      const newSelected = new Set(selectedCareers);
      newSelected.delete(careerId);
      onSelectedCareersChange(newSelected);
      // colapsar
      const newExpanded = new Set(expandedCareers);
      newExpanded.delete(careerId);
      onExpandedCareersChange(newExpanded);
      // eliminar asignaciones de esa carrera
      const filtered = assignments.filter((a) => a.careerId !== careerId);
      if (filtered.length !== assignments.length) {
        onAssignmentsChange(filtered);
      }
    },
    [assignments, selectedCareers, expandedCareers, onAssignmentsChange, onSelectedCareersChange, onExpandedCareersChange]
  );

  const toggleYear = useCallback((careerId: string, year: number) => {
    const yearKey = `${careerId}-${year}`;
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(yearKey)) {
      newExpanded.delete(yearKey);
    } else {
      newExpanded.add(yearKey);
    }
    onExpandedYearsChange(newExpanded);
  }, [expandedYears, onExpandedYearsChange]);

  // Función para remover un año completo
  const removeYear = useCallback(
    (careerId: string, year: number) => {
      const filtered = assignments.filter(
        (a) => !(a.careerId === careerId && a.year === year)
      );
      onAssignmentsChange(filtered);
      // Colapsar el año
      const yearKey = `${careerId}-${year}`;
      const newExpanded = new Set(expandedYears);
      newExpanded.delete(yearKey);
      onExpandedYearsChange(newExpanded);
    },
    [assignments, expandedYears, onAssignmentsChange, onExpandedYearsChange]
  );

  // Función para agregar un año (inicializar con asignaciones vacías)
  const addYear = useCallback(
    (careerId: string, year: number) => {
      // Expandir el año automáticamente
      const yearKey = `${careerId}-${year}`;
      const newExpanded = new Set(expandedYears);
      newExpanded.add(yearKey);
      onExpandedYearsChange(newExpanded);
      // El año se poblará automáticamente cuando se expanda (YearSubjectsContent)
    },
    [expandedYears, onExpandedYearsChange]
  );

  const removeAssignment = useCallback(
    (index: number) => {
      const target = assignments[index];
      if (!target) return;

      const newAssignments = assignments.filter((a, i) =>
        i === index
          ? false
          : !(
              a.careerId === target.careerId &&
              a.year === target.year &&
              a.competencyId === target.competencyId
            )
      );
      onAssignmentsChange(newAssignments);
    },
    [assignments, onAssignmentsChange]
  );

  const updateAssignment = useCallback(
    (index: number, field: "competencyId" | "subjectId", value: string) => {
      const newAssignments = [...assignments];
      newAssignments[index] = { ...newAssignments[index], [field]: value };
      onAssignmentsChange(newAssignments);
    },
    [assignments, onAssignmentsChange]
  );

  const ensureAssignmentsForSubjects = useCallback(
    (careerId: string, year: number) => {
      // Regla: debe existir exactamente una fila por competencia y año; preasignar competencyId.
      const competencyIds = competencies.map((c) => c.id);
      const next = [...assignments];

      const indices = next
        .map((a, idx) => ({ a, idx }))
        .filter(({ a }) => a.careerId === careerId && a.year === year);

      const usedCompetencyIds = new Set(
        indices.map(({ a }) => a.competencyId).filter(Boolean) as string[]
      );

      // 2) Completar competencyId faltantes reutilizando filas vacías
      const remainingCompetencyIds = competencyIds.filter(
        (id) => !usedCompetencyIds.has(id)
      );
      for (const item of indices) {
        if (!item.a.competencyId && remainingCompetencyIds.length > 0) {
          item.a.competencyId = remainingCompetencyIds.shift()!;
        }
      }

      // 3) Si aún faltan competencias, crear filas
      for (const compId of remainingCompetencyIds) {
        next.push({
          careerId,
          year,
          competencyId: compId,
          subjectId: "",
        });
      }

      // 4) Si sobran filas respecto a competencias, eliminar filas vacías sobrantes
      const yearRows = next.filter(
        (a) => a.careerId === careerId && a.year === year
      );
      if (yearRows.length > competencyIds.length) {
        let toRemove = yearRows.length - competencyIds.length;
        for (let i = next.length - 1; i >= 0 && toRemove > 0; i--) {
          const a = next[i];
          if (
            a.careerId === careerId &&
            a.year === year &&
            !a.subjectId &&
            (!a.competencyId || !competencyIds.includes(a.competencyId))
          ) {
            next.splice(i, 1);
            toRemove--;
          }
        }
      }

      // 5) Persistir si hubo cambios
      const changed = JSON.stringify(assignments) !== JSON.stringify(next);
      if (changed) onAssignmentsChange(next);
    },
    [assignments, competencies, onAssignmentsChange]
  );

  const renderYearContent = (careerId: string, year: number) => {
    const yearAssignments = getAssignmentsForCareerAndYear(
      assignments,
      careerId,
      year
    );
    const yearKey = `${careerId}-${year}`;
    const isYearExpanded = expandedYears.has(yearKey);
    const isYearCompleted =
      yearAssignments.length > 0 &&
      yearAssignments.every((a) => a.competencyId && a.subjectId);
    const hasAssignments = yearAssignments.length > 0;

    return (
      <YearSection
        year={year}
        subjectCount={0} // Se calculará cuando se expanda
        assignmentCount={yearAssignments.length}
        isExpanded={isYearExpanded}
        onToggle={() => toggleYear(careerId, year)}
        // Ocultamos el botón de agregar para que no sobrepase el límite de competencias
        showAddButton={false}
        isCompleted={isYearCompleted}
        onRemove={hasAssignments ? () => removeYear(careerId, year) : undefined}
        onAdd={!hasAssignments ? () => addYear(careerId, year) : undefined}
      >
        {isYearExpanded && (
          <YearSubjectsContent
            careerId={careerId}
            year={year}
            yearAssignments={yearAssignments}
            competencies={competencies}
            onUpdateAssignment={updateAssignment}
            onRemoveAssignment={removeAssignment}
            assignments={assignments}
            onEnsureAssignmentsForSubjects={ensureAssignmentsForSubjects}
          />
        )}
      </YearSection>
    );
  };

  if (careersLoading || competenciesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Asignaciones por Carrera y Año
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Asignaciones por Carrera y Año
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {assignmentCountText}
          </div>
        </div>
      </div>

      {/* Selector de tecnicaturas a incluir */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Tecnicaturas incluidas
        </div>
        <div className="flex gap-2">
          <SmartSelect
            value={careerToAdd}
            onValueChange={(v) => {
              setCareerToAdd(v);
              addCareer(v);
            }}
            placeholder={
              availableCareers.length
                ? "Agregar tecnicatura"
                : "Sin tecnicaturas disponibles"
            }
            options={availableCareers}
            renderOption={(c) => c.name}
            triggerClassName="min-w-[240px]"
          />
        </div>
      </div>

      {selectedCareers.size === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground rounded-lg">
          <p className="text-muted-foreground">
            No hay tecnicaturas seleccionadas. Usa "Agregar tecnicatura" para
            comenzar.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {selectedCareersList.map((career) => {
            const careerAssignments = assignments.filter(
              (a) => a.careerId === career.id
            );

            // Calcular años con asignaciones (no necesariamente todos los años)
            const yearsWithAssignments = new Set(
              careerAssignments
                .filter((a) => a.year !== undefined)
                .map((a) => a.year!)
            );
            const totalYearsWithAssignments = yearsWithAssignments.size;
            const completedYears = Array.from(yearsWithAssignments).reduce((acc, y) => {
              const yearRows = careerAssignments.filter((a) => a.year === y);
              if (yearRows.length === 0) return acc;
              const isYearDone = yearRows.every(
                (a) => Boolean(a.competencyId) && Boolean(a.subjectId)
              );
              return acc + (isYearDone ? 1 : 0);
            }, 0);

            return (
              <CareerCard
                key={career.id}
                career={career}
                isExpanded={expandedCareers.has(career.id)}
                onToggle={() => toggleCareer(career.id)}
                isCompleted={false}
                completedYears={completedYears}
                totalYears={totalYearsWithAssignments || 0}
                onRemove={() => removeCareer(career.id)}
              >
                <div className="space-y-4">
                  {/* Mostrar años con asignaciones y opción de agregar años nuevos */}
                  {(() => {
                    const yearsWithAssignments = new Set(
                      careerAssignments
                        .filter((a) => a.year !== undefined)
                        .map((a) => a.year!)
                    );
                    const allYears = [1, 2, 3];
                    const yearsToShow = new Set(allYears);
                    
                    // Incluir todos los años para permitir agregar años nuevos
                    return allYears.map((year) => renderYearContent(career.id, year));
                  })()}
                </div>
              </CareerCard>
            );
          })}
      </div>
    </div>
  );
}

// Componente separado para manejar las asignaturas de un año específico
function YearSubjectsContent({
  careerId,
  year,
  yearAssignments,
  competencies,
  onUpdateAssignment,
  onRemoveAssignment,
  assignments,
  onEnsureAssignmentsForSubjects,
}: {
  careerId: string;
  year: number;
  yearAssignments: Assignment[];
  competencies: { id: string; name: string }[];
  onUpdateAssignment: (
    index: number,
    field: "competencyId" | "subjectId",
    value: string
  ) => void;
  onRemoveAssignment: (index: number) => void;
  assignments: Assignment[];
  onEnsureAssignmentsForSubjects: (
    careerId: string,
    year: number,
    subjectIds: string[]
  ) => void;
}) {
  const { data: yearSubjects = [], isLoading: subjectsLoading } =
    useSubjectsByCareer(careerId, year.toString(), false);
  const subjectIds = yearSubjects.map((s) => s.id);

  // Auto-poblar una asignación por asignatura del año (competencia vacía)
  // Se asegura de no duplicar si ya existen
  if (!subjectsLoading && subjectIds.length > 0) {
    onEnsureAssignmentsForSubjects(careerId, year, subjectIds);
  }

  if (subjectsLoading) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Cargando asignaturas...
      </div>
    );
  }

  // Construir conjuntos de exclusión dentro del mismo año
  const usedCompetencyIds = buildExclusionSet(
    yearAssignments,
    (a) => a.competencyId || undefined,
    (a) => !a.competencyId
  );
  const usedSubjectIds = buildExclusionSet(
    yearAssignments,
    (a) => a.subjectId || undefined,
    (a) => !a.subjectId
  );
  const usedProfessorIds = new Set<string>();
  for (const a of yearAssignments) {
    if (a.subjectId) {
      const subj = yearSubjects.find((s) => s.id === a.subjectId);
      if (subj?.professorId) usedProfessorIds.add(subj.professorId);
    }
  }

  return (
    <>
      {yearAssignments.map((assignment, index) => {
        const assignmentIndex = assignments.findIndex(
          (a) =>
            a.careerId === careerId &&
            a.year === year &&
            a.competencyId === assignment.competencyId &&
            a.subjectId === assignment.subjectId
        );

        const availableCompetencies = filterOptionsById(
          competencies,
          usedCompetencyIds,
          assignment.competencyId
        );

        const availableSubjects = yearSubjects.filter((s) => {
          const keepSubject =
            s.id === assignment.subjectId || !usedSubjectIds.has(s.id);
          const keepProfessor =
            !s.professorId ||
            s.id === assignment.subjectId ||
            !usedProfessorIds.has(s.professorId);
          return keepSubject && keepProfessor;
        });

        return (
          <AssignmentForm
            key={index}
            assignment={assignment}
            competencies={availableCompetencies}
            subjects={availableSubjects}
            onUpdate={(field, value) =>
              onUpdateAssignment(assignmentIndex, field, value)
            }
            onRemove={() => onRemoveAssignment(assignmentIndex)}
          />
        );
      })}

      {yearAssignments.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No hay asignaciones para este año
        </div>
      )}
    </>
  );
}
