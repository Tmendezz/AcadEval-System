import { useState, useMemo } from "react";
import { Assignment } from "../../../types/evaluation-form";
import { useTechnicalCareers } from "@/shared/hooks/use-technical-careers";
import { useSubjectsByCareer } from "@/shared/hooks/use-subjects";
import { useCompetencies } from "@/shared/hooks/use-competencies";
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
} from "@/shared/lib/unique-options";
import { SmartSelect } from "@/shared/components/ui/smart-select";

interface CareerCompetencyAssignmentsStepProps {
  assignments: Assignment[];
  onAssignmentsChange: (assignments: Assignment[]) => void;
}

export function CareerCompetencyAssignmentsStep({
  assignments,
  onAssignmentsChange,
}: CareerCompetencyAssignmentsStepProps) {
  const [expandedCareers, setExpandedCareers] = useState<Set<string>>(
    new Set()
  );
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [selectedCareers, setSelectedCareers] = useState<Set<string>>(
    new Set()
  );
  const [careerToAdd, setCareerToAdd] = useState<string>("");

  // Obtener datos del backend
  const { data: careers = [], isLoading: careersLoading } =
    useTechnicalCareers();
  const { data: competencies = [], isLoading: competenciesLoading } =
    useCompetencies();

  // carreras disponibles para agregar (excluyendo las ya seleccionadas)
  const availableCareers = useMemo(
    () => careers.filter((c) => !selectedCareers.has(c.id)),
    [careers, selectedCareers]
  );

  const toggleCareer = (careerId: string) => {
    const newExpanded = new Set(expandedCareers);
    if (newExpanded.has(careerId)) {
      newExpanded.delete(careerId);
    } else {
      newExpanded.add(careerId);
    }
    setExpandedCareers(newExpanded);
  };

  const addCareer = (careerId: string) => {
    if (!careerId) return;
    const newSet = new Set(selectedCareers);
    newSet.add(careerId);
    setSelectedCareers(newSet);
    setCareerToAdd("");
    // expandir automáticamente
    const newExpanded = new Set(expandedCareers);
    newExpanded.add(careerId);
    setExpandedCareers(newExpanded);
  };

  const removeCareer = (careerId: string) => {
    const newSelected = new Set(selectedCareers);
    newSelected.delete(careerId);
    setSelectedCareers(newSelected);
    // colapsar
    const newExpanded = new Set(expandedCareers);
    newExpanded.delete(careerId);
    setExpandedCareers(newExpanded);
    // eliminar asignaciones de esa carrera
    const filtered = assignments.filter((a) => a.careerId !== careerId);
    if (filtered.length !== assignments.length) {
      onAssignmentsChange(filtered);
    }
  };

  const toggleYear = (careerId: string, year: number) => {
    const yearKey = `${careerId}-${year}`;
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(yearKey)) {
      newExpanded.delete(yearKey);
    } else {
      newExpanded.add(yearKey);
    }
    setExpandedYears(newExpanded);
  };

  const removeAssignment = (index: number) => {
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
  };

  const updateAssignment = (
    index: number,
    field: "competencyId" | "subjectId",
    value: string
  ) => {
    const newAssignments = [...assignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    onAssignmentsChange(newAssignments);
  };

  const ensureAssignmentsForSubjects = (
    careerId: string,
    year: number,
    _subjectIds: string[]
  ) => {
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
  };

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
            {formatAssignmentCount(assignments.length)}
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
        {careers
          .filter((c) => selectedCareers.has(c.id))
          .map((career) => {
            const careerAssignments = assignments.filter(
              (a) => a.careerId === career.id
            );

            const years = [1, 2, 3];
            const completedYears = years.reduce((acc, y) => {
              const yearRows = careerAssignments.filter((a) => a.year === y);
              if (yearRows.length === 0) return acc; // no cuenta si no tiene filas
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
                totalYears={3}
                onRemove={() => removeCareer(career.id)}
              >
                <div className="space-y-4">
                  {[1, 2, 3].map((year) => renderYearContent(career.id, year))}
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
  competencies: any[];
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
