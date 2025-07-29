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

  // Obtener datos del backend
  const { data: careers = [], isLoading: careersLoading } =
    useTechnicalCareers();
  const { data: competencies = [], isLoading: competenciesLoading } =
    useCompetencies();

  const toggleCareer = (careerId: string) => {
    const newExpanded = new Set(expandedCareers);
    if (newExpanded.has(careerId)) {
      newExpanded.delete(careerId);
    } else {
      newExpanded.add(careerId);
    }
    setExpandedCareers(newExpanded);
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

  const addAssignment = (careerId: string, year: number) => {
    const newAssignment: Assignment = {
      careerId,
      year,
      competencyId: "",
      subjectId: "",
    };
    onAssignmentsChange([...assignments, newAssignment]);
  };

  const removeAssignment = (index: number) => {
    const newAssignments = assignments.filter((_, i) => i !== index);
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

  const renderYearContent = (careerId: string, year: number) => {
    const yearAssignments = getAssignmentsForCareerAndYear(
      assignments,
      careerId,
      year
    );
    const yearKey = `${careerId}-${year}`;
    const isYearExpanded = expandedYears.has(yearKey);

    return (
      <YearSection
        careerId={careerId}
        year={year}
        subjectCount={0} // Se calculará cuando se expanda
        assignmentCount={yearAssignments.length}
        isExpanded={isYearExpanded}
        onToggle={() => toggleYear(careerId, year)}
        onAddAssignment={() => addAssignment(careerId, year)}
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
        <div className="text-sm text-muted-foreground">
          {formatAssignmentCount(assignments.length)}
        </div>
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground rounded-lg">
          <p className="text-muted-foreground">
            No hay asignaciones configuradas. Selecciona una carrera y año para
            comenzar.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {careers.map((career) => (
          <CareerCard
            key={career.id}
            career={career}
            isExpanded={expandedCareers.has(career.id)}
            onToggle={() => toggleCareer(career.id)}
          >
            <div className="space-y-4">
              {[1, 2, 3].map((year) => renderYearContent(career.id, year))}
            </div>
          </CareerCard>
        ))}
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
}) {
  const { data: yearSubjects = [], isLoading: subjectsLoading } =
    useSubjectsByCareer(careerId, year.toString(), false);

  if (subjectsLoading) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Cargando asignaturas...
      </div>
    );
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

        return (
          <AssignmentForm
            key={index}
            assignment={assignment}
            competencies={competencies}
            subjects={yearSubjects}
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
