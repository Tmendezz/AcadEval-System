import { useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";
import {
  getTechnicalCareerById,
  updateTechnicalCareer,
  assignCareerCoordinator,
} from "@/shared/services/technical-career-service";
import { createProfessor } from "@/shared/services/professor-service";
import * as subjectService from "@/shared/services/subject-service";
import { useProfessors } from "@/shared/hooks/use-professors";
import type { Professor } from "@/shared/types/professor";
import type { Subject } from "@/shared/types/subject";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { ProfessorCombobox } from "@/shared/components/ui/professor-combobox";

type SubjectRow = Subject & {
  draftNewProfessor?: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  };
};

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

  const [search, setSearch] = useState("");
  const { data: professorsData, isFetching: isSearching } = useProfessors(
    1,
    1000,
    search || undefined
  );
  const existingProfessors: Professor[] = professorsData?.professors ?? [];

  const [name, setName] = useState("");
  const [rows, setRows] = useState<SubjectRow[]>([]);
  const [coordinatorToken, setCoordinatorToken] = useState<string>("");

  useEffect(() => {
    if (career?.name) setName(career.name);
    if (subjects.length) setRows(subjects as SubjectRow[]);
  }, [career, subjects]);

  const coordinatorCandidates = useMemo(() => {
    const list: { value: string; label: string }[] = [];
    const seen = new Set<string>();
    rows.forEach((r, idx) => {
      if (r.professorId) {
        const key = `id:${r.professorId}`;
        if (!seen.has(key)) {
          const prof = existingProfessors.find((p) => p.id === r.professorId);
          list.push({
            value: key,
            label: prof ? `${prof.name} — ${prof.email}` : r.professorId,
          });
          seen.add(key);
        }
      }
      if (r.draftNewProfessor?.email) {
        const key = `new:${idx}`;
        if (!seen.has(key)) {
          list.push({
            value: key,
            label: `${r.draftNewProfessor.name} — ${r.draftNewProfessor.email}`,
          });
          seen.add(key);
        }
      }
    });
    return list;
  }, [rows, existingProfessors]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!careerId) return;
      await updateTechnicalCareer(careerId, { name });

      const newProfessorIdByIndex = new Map<number, string>();

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];

        // Crear profesor si corresponde
        let professorId = r.professorId;
        if (!professorId && r.draftNewProfessor) {
          professorId = await createProfessor({
            name: r.draftNewProfessor.name,
            email: r.draftNewProfessor.email,
            password: r.draftNewProfessor.password,
            phone: r.draftNewProfessor.phone,
          });
          newProfessorIdByIndex.set(i, professorId);
        }

        // Actualizar asignatura
        await subjectService.updateSubject(careerId, r.id, {
          name: r.name,
          description: r.description,
          year: r.year,
        });

        // Asignar profesor
        if (professorId) {
          await subjectService.assignProfessor(careerId, r.id, professorId);
        }
      }

      // Resolver coordinador
      if (coordinatorToken) {
        let coordinatorUserId = "";
        if (coordinatorToken.startsWith("id:")) {
          coordinatorUserId = coordinatorToken.slice(3);
        } else if (coordinatorToken.startsWith("new:")) {
          const idxStr = coordinatorToken.slice(4);
          const idx = Number(idxStr);
          const createdId = newProfessorIdByIndex.get(idx);
          if (createdId) coordinatorUserId = createdId;
        }
        if (coordinatorUserId) {
          await assignCareerCoordinator(careerId, coordinatorUserId);
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      await queryClient.invalidateQueries({ queryKey: ["subjects", careerId] });
      toast.success("Tecnicatura actualizada correctamente.");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<any>;
      const serverMsg =
        (axiosErr.response?.data as any)?.Message ||
        (axiosErr.response?.data as any)?.message ||
        axiosErr.message ||
        "No se pudo guardar los cambios";
      toast.error(serverMsg);
    },
  });

  return (
    <PageLayout>
      <PageHeader
        title="Editar Tecnicatura"
        description="Actualiza datos, profesores y coordinador"
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
                    className="grid grid-cols-1 md:grid-cols-6 gap-3"
                  >
                    <Input
                      value={r.name}
                      onChange={(e) => (
                        (r.name = e.target.value), setRows([...rows])
                      )}
                    />
                    <ProfessorCombobox
                      value={r.professorId || ""}
                      onChange={(v) => {
                        if (!v) return;
                        r.professorId = v;
                        setRows([...rows]);
                      }}
                      options={(() => {
                        const options = existingProfessors.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }));
                        // Asegurar que, si la asignatura ya tiene profesor asignado
                        // pero no está en la lista cargada, se muestre igualmente.
                        if (
                          r.professorId &&
                          !options.some((o) => o.value === r.professorId)
                        ) {
                          options.unshift({
                            value: r.professorId,
                            label: r.professorName ?? "Profesor asignado",
                          });
                        }
                        return options;
                      })()}
                      onSearch={setSearch}
                      isLoading={isSearching}
                      searchTerm={search}
                      placeholder="Profesor"
                    />
                  </div>
                ))}
            </div>
          </Card>
        ))}

        <Card className="p-4 space-y-3">
          <label className="text-sm font-medium">Coordinador</label>
          <Select value={coordinatorToken} onValueChange={setCoordinatorToken}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione coordinador entre profesores de las materias" />
            </SelectTrigger>
            <SelectContent>
              {coordinatorCandidates.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!name || saveMutation.isPending}
          >
            Guardar cambios
          </Button>
        </div>
      </PageContent>
    </PageLayout>
  );
}
