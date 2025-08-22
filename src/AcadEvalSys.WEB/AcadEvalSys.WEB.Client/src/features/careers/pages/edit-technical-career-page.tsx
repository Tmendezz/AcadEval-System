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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  getTechnicalCareerById,
  updateTechnicalCareer,
  assignCareerCoordinator,
  getCareerCoordinator,
  removeCareerCoordinator,
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

  // Obtener coordinador actual
  const { data: currentCoordinator } = useQuery({
    queryKey: ["career-coordinator", careerId],
    queryFn: () => getCareerCoordinator(careerId || ""),
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
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>("");
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

  // Establecer coordinador actual cuando se carga
  useEffect(() => {
    if (currentCoordinator) {
      setSelectedCoordinator(currentCoordinator.userId);
    }
  }, [currentCoordinator]);

  // Obtener candidatos para coordinador (profesores que dictan materias en la carrera)
  const coordinatorCandidates = existingProfessors.filter((professor) =>
    rows.some((row) => row.professorId === professor.id)
  );

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

      // Gestionar coordinador
      if (
        selectedCoordinator &&
        selectedCoordinator !== currentCoordinator?.userId
      ) {
        // Asignar nuevo coordinador
        await assignCareerCoordinator(careerId, selectedCoordinator);
        toast.success("Coordinador asignado correctamente");
      } else if (!selectedCoordinator && currentCoordinator) {
        // Quitar coordinador actual
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

        {/* Selector de Coordinador */}
        <Card className="p-4 space-y-3">
          <label className="text-sm font-medium">
            Coordinador de la carrera
          </label>

          {/* Mostrar coordinador actual si existe */}
          {currentCoordinator && (
            <div className="p-3 bg-muted/50 rounded-md border">
              <p className="text-sm font-medium">Coordinador actual:</p>
              <p className="text-sm text-muted-foreground">
                {currentCoordinator.name} ({currentCoordinator.email})
                {currentCoordinator.phone && ` - ${currentCoordinator.phone}`}
              </p>
            </div>
          )}

          <Select
            value={selectedCoordinator}
            onValueChange={setSelectedCoordinator}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un coordinador entre los profesores de las materias" />
            </SelectTrigger>
            <SelectContent>
              {coordinatorCandidates.map((professor) => (
                <SelectItem key={professor.id} value={professor.id}>
                  {professor.name}
                  {currentCoordinator?.userId === professor.id && " (actual)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            Solo se muestran profesores que dictan materias en esta carrera
          </p>

          {/* Validación en tiempo real */}
          {selectedCoordinator &&
            selectedCoordinator !== currentCoordinator?.userId && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                Profesor seleccionado como nuevo coordinador
              </div>
            )}

          {!selectedCoordinator && currentCoordinator && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
              ⚠️ Se quitará el coordinador actual
            </div>
          )}

          {/* Botón para quitar coordinador */}
          {currentCoordinator && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCoordinator("")}
              className="w-full"
            >
              Quitar coordinador actual
            </Button>
          )}
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
