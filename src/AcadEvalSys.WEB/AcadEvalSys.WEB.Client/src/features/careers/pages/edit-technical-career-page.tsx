import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import {
  getTechnicalCareerById,
  updateTechnicalCareer,
} from "@/shared/services/technical-career-service";
import * as subjectService from "@/shared/services/subject-service";
import { useProfessors } from "@/shared/hooks/use-professors";
import type { Professor } from "@/shared/types/professor";
import type { Subject } from "@/shared/types/subject";
import { toast } from "sonner";
import { ProfessorCombobox } from "@/shared/components/ui/professor-combobox";

// Local row model matches Subject
type SubjectRow = Subject;

export default function EditTechnicalCareerPage() {
  const { careerId } = useParams();
  const queryClient = useQueryClient();

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

  // Professors: list ALL created (no career filter)
  const [search, setSearch] = useState("");
  const { data: professorsData, isFetching: isSearching } = useProfessors(
    1,
    1000,
    search || undefined
  );
  const existingProfessors: Professor[] = professorsData?.professors ?? [];

  const [name, setName] = useState("");
  const [rows, setRows] = useState<SubjectRow[]>([]);
  // Snapshot de asignaciones originales para evitar PUT redundantes
  const [initialProfBySubject, setInitialProfBySubject] = useState<
    Record<string, string | undefined>
  >({});

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
      // Construir snapshot original de profesor por materia
      setInitialProfBySubject(
        Object.fromEntries(subjects.map((s) => [s.id, s.professorId]))
      );
    }
  }, [career, subjects]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!careerId) return;

      const currentName = career?.name ?? "";
      const effectiveName = (name ?? "").trim() || currentName;
      if (effectiveName && effectiveName !== currentName) {
        await updateTechnicalCareer(careerId, { name: effectiveName });
      }

      // Assign selected professors for each subject row
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const original = initialProfBySubject[r.id];
        const currentProfessorId = r.professorId;
        const originalProfessorId = original;

        // Comparar IDs de profesor, manejando undefined/null
        const changed = currentProfessorId !== originalProfessorId;

        if (changed && currentProfessorId) {
          // Solo asignar si hay un profesor seleccionado
          await subjectService.assignProfessor(
            careerId,
            r.id,
            currentProfessorId
          );
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      await queryClient.invalidateQueries({
        queryKey: ["technical-career", careerId],
      });
      await queryClient.invalidateQueries({ queryKey: ["subjects", careerId] });
      toast.success("Tecnicatura actualizada correctamente.");
      // Refrescar snapshot local tras guardar
      setInitialProfBySubject(
        Object.fromEntries(rows.map((r) => [r.id, r.professorId]))
      );
    },
    onError: () => {
      toast.error("No se pudo guardar los cambios");
    },
  });

  return (
    <PageLayout>
      <PageHeader
        title="Editar Tecnicatura"
        description="Actualiza datos y profesores"
      />
      <PageContent className="space-y-6">
        <Card className="p-4 space-y-3">
          <label className="text-sm font-medium">Nombre de la carrera</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Tecnicatura en Programación"
          />
        </Card>

        {["First", "Second", "Third"].map((yearKey) => (
          <Card key={yearKey} className="p-4 space-y-3">
            <span className="font-semibold">
              {yearKey === "First"
                ? "1° Año"
                : yearKey === "Second"
                ? "2° Año"
                : "3° Año"}
            </span>
            <div className="space-y-4">
              {rows
                .filter((r) => r.year === (yearKey as any))
                .map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Asignatura:
                      </label>
                      <Input
                        value={r.name}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((row) =>
                              row.id === r.id
                                ? ({
                                    ...row,
                                    name: e.target.value,
                                  } as SubjectRow)
                                : row
                            )
                          )
                        }
                        placeholder="Nombre de la asignatura"
                      />
                    </div>

                    <div className="md:col-span-7">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Profesor:
                      </label>
                      <ProfessorCombobox
                        value={r.professorId}
                        onChange={(v) => {
                          if (!v) return;

                          setRows((prev) =>
                            prev.map((row) => {
                              if (row.id !== r.id) return row;
                              const prof = existingProfessors.find(
                                (p) => p.id === v
                              );
                              return {
                                ...row,
                                professorId: v,
                                professorName:
                                  prof?.name || "Profesor asignado",
                              } as SubjectRow;
                            })
                          );
                        }}
                        options={(() => {
                          const opts = existingProfessors.map((p) => ({
                            value: p.id,
                            label: `${p.name}`,
                          }));
                          if (
                            r.professorId &&
                            !opts.some((o) => o.value === r.professorId)
                          ) {
                            opts.unshift({
                              value: r.professorId,
                              label: r.professorName || "Profesor asignado",
                            });
                          }
                          return opts;
                        })()}
                        onSearch={setSearch}
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
        ))}

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            Guardar cambios
          </Button>
        </div>
      </PageContent>
    </PageLayout>
  );
}
