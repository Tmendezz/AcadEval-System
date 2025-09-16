import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTechnicalCareerById,
  assignCareerCoordinator,
  getCareerCoordinator,
  removeCareerCoordinator,
} from "@infrastructure/api/clients/technical-career-service";
import { useUpdateTechnicalCareer } from "@/shared/hooks/use-technical-careers";
import * as subjectService from "@infrastructure/api/clients/subject-service";
import { useProfessors } from "@/shared/hooks/use-professors";
import { useDeleteSubject } from "./use-delete-subject";
import type { Professor } from "@infrastructure/api/types/professor";
import type { Subject } from "@infrastructure/api/types/subject";

// Local row model matches Subject, with optional id for new subjects
type SubjectRow = Subject & { isNew?: boolean };

export function useEditCareer(careerId: string | undefined) {
  const queryClient = useQueryClient();
  const updateCareerMutation = useUpdateTechnicalCareer();
  const deleteSubjectMutation = useDeleteSubject();

  // Queries
  const { data: career } = useQuery({
    queryKey: ["technical-career", careerId],
    queryFn: () => getTechnicalCareerById(careerId || ""),
    enabled: !!careerId,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", careerId],
    queryFn: () =>
      subjectService.getSubjectsByCareer(careerId || "", undefined, true),
    enabled: !!careerId,
  });

  const { data: currentCoordinator } = useQuery({
    queryKey: ["career-coordinator", careerId],
    queryFn: () => getCareerCoordinator(careerId || ""),
    enabled: !!careerId,
  });

  // Professors
  const [search, setSearch] = useState("");
  const { data: professorsData, isFetching: isSearching } = useProfessors(
    1,
    1000,
    search || undefined
  );
  const existingProfessors: Professor[] = professorsData?.professors ?? [];

  // Local state
  const [name, setName] = useState("");
  const [rows, setRows] = useState<SubjectRow[]>([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>("");

  // Effects
  useEffect(() => {
    if (career?.name) setName(career.name);
    if (subjects.length) {
      setRows(
        subjects.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          year: s.year,
          professorId: s.professorId,
          professorName: s.professorName,
        }))
      );
    }
  }, [career, subjects]);

  useEffect(() => {
    if (currentCoordinator) {
      setSelectedCoordinator(currentCoordinator.userId);
    }
  }, [currentCoordinator]);

  // Computed values
  const coordinatorCandidates = existingProfessors.filter((professor) =>
    rows.some((row) => row.professorId === professor.id)
  );

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!careerId) return;

      const currentName = career?.name ?? "";
      const effectiveName = (name ?? "").trim() || currentName;
      if (effectiveName && effectiveName !== currentName) {
        await updateCareerMutation.mutateAsync({
          id: careerId,
          career: { name: effectiveName },
        });
      }

      // Procesar asignaturas (crear nuevas y actualizar existentes)
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];

        // Si es una asignatura nueva, crearla
        if (r.isNew) {
          // Solo crear si tiene nombre
          if (r.name.trim()) {
            const subjectId = await subjectService.createSubject(careerId, {
              name: r.name,
              description: r.description || `Descripción de ${r.name}`,
              year: r.year,
              professorId: r.professorId || undefined,
            });
            
            // Si tiene profesor asignado, asignarlo
            if (r.professorId) {
              await subjectService.assignProfessor(
                careerId,
                subjectId,
                r.professorId
              );
            }
          }
        } else {
          // Es una asignatura existente, verificar si necesita actualización
          const originalSubject = subjects.find((s) => s.id === r.id);

          if (originalSubject) {
            const nameChanged = r.name !== originalSubject.name;
            const professorChanged =
              r.professorId !== originalSubject.professorId;

            if (nameChanged || professorChanged) {
              const updateData = {
                name: r.name,
                description: r.description || originalSubject.description,
                year: r.year,
                professorId: r.professorId,
              };

              await subjectService.updateSubject(careerId, r.id, updateData);
            }
          }
        }
      }

      // Gestionar coordinador
      if (
        selectedCoordinator &&
        selectedCoordinator !== currentCoordinator?.userId
      ) {
        await assignCareerCoordinator(careerId, selectedCoordinator);
        toast.success("Coordinador asignado correctamente");
      } else if (!selectedCoordinator && currentCoordinator) {
        await removeCareerCoordinator(careerId);
        toast.success("Coordinador removido correctamente");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      await queryClient.invalidateQueries({
        queryKey: ["technical-career", careerId],
      });
      await queryClient.invalidateQueries({ queryKey: ["subjects", careerId] });
      await queryClient.invalidateQueries({
        queryKey: ["career-coordinator", careerId],
      });
      toast.success("Tecnicatura actualizada correctamente.");
    },
    onError: () => {
      toast.error("No se pudo guardar los cambios");
    },
  });

  // Helper functions
  const updateSubjectName = (subjectId: string, newName: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === subjectId ? ({ ...row, name: newName } as SubjectRow) : row
      )
    );
  };

  const updateSubjectProfessor = (subjectId: string, professorId: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== subjectId) return row;
        const prof = existingProfessors.find((p) => p.id === professorId);
        return {
          ...row,
          professorId,
          professorName: prof?.name || "Profesor asignado",
        } as SubjectRow;
      })
    );
  };

  const addSubject = (year: "First" | "Second" | "Third") => {
    const newSubject: SubjectRow = {
      id: `temp-${Date.now()}`, // ID temporal hasta que se guarde
      name: "",
      description: "Nueva asignatura", // Descripción por defecto para evitar validación
      year,
      professorId: "",
      professorName: "",
      isNew: true,
    };
    setRows((prev) => [...prev, newSubject]);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!careerId) return;

    // Si es una asignatura nueva (solo local), simplemente la removemos
    const subject = rows.find((row) => row.id === subjectId);
    if (subject?.isNew) {
      setRows((prev) => prev.filter((row) => row.id !== subjectId));
      return;
    }

    // Si es una asignatura existente, la eliminamos del servidor
    await deleteSubjectMutation.mutateAsync({
      careerId,
      subjectId,
    });

    // Remover la asignatura de la lista local
    setRows((prev) => prev.filter((row) => row.id !== subjectId));
  };

  return {
    // Data
    career,
    subjects,
    currentCoordinator,
    existingProfessors,
    coordinatorCandidates,

    // State
    name,
    setName,
    rows,
    selectedCoordinator,
    setSelectedCoordinator,
    search,
    setSearch,
    isSearching,

    // Mutations
    saveMutation,

    // Helper functions
    updateSubjectName,
    updateSubjectProfessor,
    addSubject,
    handleDeleteSubject,
  };
}
