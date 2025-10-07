import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { technicalCareerService } from "../services/technical-career-service";
import { professorService } from "@/features/administration/services/professor-service";
import * as subjectService from "../services/subject-service";
import { useProfessors } from "@/shared/hooks/use-professors";
import type { Professor } from "../models";
import { ProfessorCombobox } from "../components/professor-combobox";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type SubjectDraft = {
  name: string;
  description: string;
  year: "First" | "Second" | "Third";
  professorId?: string;
  newProfessor?: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  };
};

export function CreateCareerForm() {
  const queryClient = useQueryClient();
  const [careerName, setCareerName] = useState("");
  const [subjects, setSubjects] = useState<SubjectDraft[]>([
    { name: "", description: "", year: "First" },
  ]);
  const [coordinatorToken, setCoordinatorToken] = useState<string>("");

  const [search, setSearch] = useState("");
  const { data: professorsData, isFetching: isSearching } = useProfessors(
    1,
    1000,
    search || undefined
  );
  const existingProfessors: Professor[] = professorsData?.items?.map(p => ({
    id: p.userId,
    name: p.name,
    email: p.email,
    phone: p.phone
  })) ?? [];

  // Mini diálogo para crear profesor
  const [newProfOpen, setNewProfOpen] = useState(false);
  const [newProfIndex, setNewProfIndex] = useState<number | null>(null);
  const [newProfName, setNewProfName] = useState("");
  const [newProfEmail, setNewProfEmail] = useState("");
  const [newProfPassword, setNewProfPassword] = useState("");

  const coordinatorCandidates = useMemo(() => {
    const list: { value: string; label: string }[] = [];
    const seen = new Set<string>();
    subjects.forEach((s, idx) => {
      if (s.professorId) {
        const key = `id:${s.professorId}`;
        if (!seen.has(key)) {
          const prof = existingProfessors.find((p) => p.id === s.professorId);
          list.push({
            value: key,
            label: prof ? `${prof.name}` : s.professorId,
          });
          seen.add(key);
        }
      }
      if (s.newProfessor?.email) {
        const key = `new:${idx}`;
        if (!seen.has(key)) {
          list.push({
            value: key,
            label: `${s.newProfessor.name}`,
          });
          seen.add(key);
        }
      }
    });
    return list;
  }, [subjects, existingProfessors]);

  const createCareerMutation = useMutation({
    mutationFn: async () => {
      const careerId = await technicalCareerService.create({ name: careerName });

      const newProfessorIdByIndex = new Map<number, string>();

      for (let i = 0; i < subjects.length; i++) {
        const s = subjects[i];
        let professorId = s.professorId;
        if (!professorId && s.newProfessor) {
          professorId = await professorService.create({
            name: s.newProfessor.name,
            email: s.newProfessor.email,
            password: s.newProfessor.password,
          });
          newProfessorIdByIndex.set(i, professorId);
        }

        const subjectId = await subjectService.createSubject(careerId, {
          name: s.name,
          description: s.description,
          year: s.year,
          professorId: undefined,
        });
        if (professorId) {
          await subjectService.assignProfessor(
            careerId,
            subjectId,
            professorId
          );
        }
      }

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
          await technicalCareerService.assignCoordinator(careerId, coordinatorUserId);
        }
      }

      return careerId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      toast.success("Tecnicatura creada correctamente.");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{
        Message?: string;
        message?: string;
      }>;
      const serverMsg =
        axiosErr.response?.data?.Message ||
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        "No se pudo crear la tecnicatura";
      toast.error(serverMsg);
    },
  });

  const addSubject = (year: "First" | "Second" | "Third") =>
    setSubjects((arr) => [...arr, { name: "", description: "", year }]);

  const renderYearSection = (
    title: string,
    year: "First" | "Second" | "Third"
  ) => (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        <Button onClick={() => addSubject(year)}>Agregar asignatura</Button>
      </div>
      <div className="space-y-4">
        {subjects
          .filter((s) => s.year === year)
          .map((s, idx) => (
            <div
              key={`${year}-${idx}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <Input
                placeholder="Nombre"
                value={s.name}
                onChange={(e) => (
                  (s.name = e.target.value), setSubjects([...subjects])
                )}
              />
              <ProfessorCombobox
                value={s.newProfessor ? `new:${idx}` : s.professorId}
                onChange={(v) => {
                  if (!v || v.startsWith("new:")) return;
                  s.professorId = v;
                  s.newProfessor = undefined;
                  setSubjects([...subjects]);
                }}
                options={(() => {
                  const opts = existingProfessors.map((p) => ({
                    value: p.id,
                    label: `${p.name}`,
                  }));
                  if (s.newProfessor) {
                    opts.unshift({
                      value: `new:${idx}`,
                      label: `${s.newProfessor.name} (nuevo)`,
                    });
                  }
                  return opts;
                })()}
                onRequestCreate={() => {
                  setNewProfIndex(idx);
                  setNewProfName("");
                  setNewProfEmail("");
                  setNewProfPassword("");
                  setNewProfOpen(true);
                }}
                placeholder="Profesor"
                onSearch={setSearch}
                isLoading={isSearching}
                searchTerm={search}
              />
            </div>
          ))}
      </div>
    </Card>
  );

  return (
    <PageLayout>
      <PageHeader
        title="Nueva Tecnicatura"
        description="Configura la tecnicatura, sus asignaturas y coordinador"
      />
      <PageContent className="space-y-6">
        <Card className="p-4 space-y-3">
          <label className="text-sm font-medium">Nombre de la carrera</label>
          <Input
            value={careerName}
            onChange={(e) => setCareerName(e.target.value)}
            placeholder="Ej: Tecnicatura en Programación"
          />
        </Card>

        {renderYearSection("1° Año", "First")}
        {renderYearSection("2° Año", "Second")}
        {renderYearSection("3° Año", "Third")}

        <Card className="p-4 space-y-3">
          <label className="text-sm font-medium">
            Coordinador de la carrera
          </label>
          <Select value={coordinatorToken} onValueChange={setCoordinatorToken}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un coordinador entre los profesores de las materias" />
            </SelectTrigger>
            <SelectContent>
              {coordinatorCandidates.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                  {c.value.startsWith("new:") && " (nuevo)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Solo se muestran profesores que dictan materias en esta carrera
          </p>
          {coordinatorCandidates.length === 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border">
              ⚠️ No hay profesores asignados a materias. Asigne profesores
              primero para poder seleccionar un coordinador.
            </p>
          )}
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => createCareerMutation.mutate()}
            disabled={!careerName || createCareerMutation.isPending}
          >
            Crear tecnicatura
          </Button>
        </div>
      </PageContent>

      {/* Dialogo crear profesor */}
      <Dialog open={newProfOpen} onOpenChange={setNewProfOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear profesor</DialogTitle>
            <DialogDescription>
              Complete los datos del profesor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Input
              placeholder="Nombre"
              value={newProfName}
              onChange={(e) => setNewProfName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={newProfEmail}
              onChange={(e) => setNewProfEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={newProfPassword}
              onChange={(e) => setNewProfPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProfOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (newProfIndex == null) return;
                subjects[newProfIndex].newProfessor = {
                  name: newProfName,
                  email: newProfEmail,
                  password: newProfPassword,
                };
                subjects[newProfIndex].professorId = undefined;
                setSubjects([...subjects]);
                setNewProfOpen(false);
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
