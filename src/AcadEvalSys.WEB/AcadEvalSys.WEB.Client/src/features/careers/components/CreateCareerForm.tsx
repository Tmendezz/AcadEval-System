import { useCallback, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
  const [, navigate] = useLocation();
  const [careerName, setCareerName] = useState("");
  const [subjects, setSubjects] = useState<SubjectDraft[]>([]);
  const [coordinatorToken, setCoordinatorToken] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const { data: professorsData, isFetching: isSearching } = useProfessors(
    1,
    1000,
    search || undefined
  );
  const existingProfessors: Professor[] = useMemo(
    () =>
      professorsData?.items?.map((p) => ({
        id: p.userId,
        name: p.name,
        email: p.email,
        phone: p.phone,
      })) ?? [],
    [professorsData?.items]
  );

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

  // Función de validación
  const validateForm = useCallback((): string[] => {
    const validationErrors: string[] = [];

    // Validar nombre de carrera
    const trimmedName = careerName.trim();
    if (!trimmedName) {
      validationErrors.push("El nombre de la tecnicatura es obligatorio.");
    } else if (trimmedName.length < 3) {
      validationErrors.push("El nombre debe tener al menos 3 caracteres.");
    } else if (trimmedName.length > 100) {
      validationErrors.push("El nombre no debe exceder 100 caracteres.");
    }

    // Validar asignaturas (las que tienen nombre)
    const subjectsWithName = subjects.filter((s) => s.name.trim() !== "");
    for (const subject of subjectsWithName) {
      if (subject.name.trim().length > 50) {
        validationErrors.push(
          `La asignatura "${subject.name.substring(0, 20)}..." excede 50 caracteres.`
        );
      }
    }

    // Validar profesores nuevos
    for (const subject of subjects) {
      if (subject.newProfessor) {
        if (!subject.newProfessor.name.trim()) {
          validationErrors.push("El nombre del profesor es obligatorio.");
        }
        if (!subject.newProfessor.email.trim()) {
          validationErrors.push("El email del profesor es obligatorio.");
        }
        if (!subject.newProfessor.password.trim()) {
          validationErrors.push("La contraseña del profesor es obligatoria.");
        }
      }
    }

    return validationErrors;
  }, [careerName, subjects]);

  const createCareerMutation = useMutation({
    mutationFn: async () => {
      const careerId = await technicalCareerService.create({ name: careerName.trim() });

      const newProfessorIdByIndex = new Map<number, string>();

      // Filtrar asignaturas válidas (con nombre)
      const validSubjects = subjects.filter((s) => s.name.trim() !== "");

      for (let i = 0; i < validSubjects.length; i++) {
        const s = validSubjects[i];
        const originalIndex = subjects.indexOf(s);
        
        let professorId = s.professorId;
        if (!professorId && s.newProfessor) {
          professorId = await professorService.create({
            name: s.newProfessor.name,
            email: s.newProfessor.email,
            password: s.newProfessor.password,
          });
          newProfessorIdByIndex.set(originalIndex, professorId);
        }

        // Usar descripción por defecto si está vacía
        const description = s.description.trim() || `Asignatura de ${s.name}`;

        const subjectId = await subjectService.createSubject(careerId, {
          name: s.name.trim(),
          description,
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
    onSuccess: async (careerId) => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
      toast.success("¡Tecnicatura creada exitosamente!", {
        description: "Redirigiendo al detalle de la tecnicatura...",
        duration: 2000,
      });
      // Redirigir al detalle de la tecnicatura después de un breve delay
      setTimeout(() => {
        navigate(`/carreras/${careerId}`);
      }, 1500);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{
        Message?: string;
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      
      // Intentar extraer errores de validación del servidor
      const serverErrors = axiosErr.response?.data?.errors;
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors).flat();
        errorMessages.forEach((msg) => toast.error(msg));
        return;
      }
      
      const serverMsg =
        axiosErr.response?.data?.Message ||
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        "No se pudo crear la tecnicatura";
      toast.error(serverMsg);
    },
  });

  // Handler para crear la tecnicatura con validación
  const handleCreateCareer = useCallback(() => {
    // Limpiar errores anteriores
    setErrors([]);

    // Validar
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    // Si no hay errores, crear la tecnicatura
    createCareerMutation.mutate();
  }, [validateForm, createCareerMutation]);

  const addSubject = useCallback(
    (year: "First" | "Second" | "Third") =>
      setSubjects((arr) => [...arr, { name: "", description: "", year }]),
    []
  );

  // Handlers para actualización inmutable del estado
  const updateSubjectName = useCallback((year: string, idx: number, name: string) => {
    setSubjects((prev) => {
      const yearSubjects = prev.filter((s) => s.year === year);
      const globalIndex = prev.findIndex((s) => s === yearSubjects[idx]);
      if (globalIndex === -1) return prev;
      
      return prev.map((s, i) => (i === globalIndex ? { ...s, name } : s));
    });
  }, []);

  const updateSubjectProfessor = useCallback((year: string, idx: number, professorId: string) => {
    setSubjects((prev) => {
      const yearSubjects = prev.filter((s) => s.year === year);
      const globalIndex = prev.findIndex((s) => s === yearSubjects[idx]);
      if (globalIndex === -1) return prev;
      
      return prev.map((s, i) =>
        i === globalIndex ? { ...s, professorId, newProfessor: undefined } : s
      );
    });
  }, []);

  const openNewProfessorDialog = useCallback((idx: number) => {
    setNewProfIndex(idx);
    setNewProfName("");
    setNewProfEmail("");
    setNewProfPassword("");
    setNewProfOpen(true);
  }, []);

  // Opciones de profesores memoizadas
  const professorOptions = useMemo(
    () =>
      existingProfessors.map((p) => ({
        value: p.id,
        label: p.name,
      })),
    [existingProfessors]
  );

  // Función para obtener opciones de un subject específico
  const getSubjectProfessorOptions = useCallback(
    (subject: SubjectDraft, idx: number) => {
      if (!subject.newProfessor) return professorOptions;
      return [
        { value: `new:${idx}`, label: `${subject.newProfessor.name} (nuevo)` },
        ...professorOptions,
      ];
    },
    [professorOptions]
  );

  const renderYearSection = useCallback(
    (title: string, year: "First" | "Second" | "Third") => {
      const yearSubjects = subjects.filter((s) => s.year === year);

      return (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{title}</span>
            <Button onClick={() => addSubject(year)}>Agregar asignatura</Button>
          </div>
          <div className="space-y-4">
            {yearSubjects.map((s, idx) => (
              <div
                key={`${year}-${idx}`}
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                <Input
                  placeholder="Nombre"
                  value={s.name}
                  onChange={(e) => updateSubjectName(year, idx, e.target.value)}
                />
                <ProfessorCombobox
                  value={s.newProfessor ? `new:${idx}` : s.professorId}
                  onChange={(v) => {
                    if (!v || v.startsWith("new:")) return;
                    updateSubjectProfessor(year, idx, v);
                  }}
                  options={getSubjectProfessorOptions(s, idx)}
                  onRequestCreate={() => openNewProfessorDialog(idx)}
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
    },
    [subjects, addSubject, updateSubjectName, updateSubjectProfessor, getSubjectProfessorOptions, openNewProfessorDialog, isSearching, search]
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

        {/* Mostrar errores de validación si existen */}
        {errors.length > 0 && (
          <Card className="p-4 border-destructive bg-destructive/10">
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">
                Por favor corrige los siguientes errores:
              </p>
              <ul className="list-disc list-inside text-sm text-destructive">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleCreateCareer}
            disabled={createCareerMutation.isPending}
          >
            {createCareerMutation.isPending ? "Creando..." : "Crear tecnicatura"}
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
                setSubjects((prev) =>
                  prev.map((s, i) =>
                    i === newProfIndex
                      ? {
                          ...s,
                          newProfessor: {
                            name: newProfName,
                            email: newProfEmail,
                            password: newProfPassword,
                          },
                          professorId: undefined,
                        }
                      : s
                  )
                );
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
