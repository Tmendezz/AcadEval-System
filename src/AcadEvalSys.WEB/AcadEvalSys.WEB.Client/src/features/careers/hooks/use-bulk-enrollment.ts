import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as subjectService from "../services/subject-service";
import { studentService } from "@/features/administration/services/student-service";
import { CareerYear } from "../models";

export function useBulkEnrollment() {
  const [isEnrollingAll, setIsEnrollingAll] = useState(false);
  const queryClient = useQueryClient();

  const enrollAllImportedIntoAllSubjects = async (
    careerId: string,
    careerYear: CareerYear
  ) => {
    try {
      setIsEnrollingAll(true);

      // Obtener materias del año indicado
      const allSubjects = await subjectService.getSubjectsByCareer(careerId);
      const targetYearString =
        careerYear === CareerYear.First
          ? "First"
          : careerYear === CareerYear.Second
          ? "Second"
          : "Third";
      const subjects = allSubjects.filter((s) => s.year === targetYearString);

      // Obtener estudiantes del año indicado
      const students = await studentService.getStudentsByCareer(
        careerId,
        careerYear
      );

      if (subjects.length === 0 || students.length === 0) {
        toast.info("No hay materias o estudiantes para inscribir.");
        return;
      }

      // Enrolar a todos en todas las materias
      const tasks: Promise<void>[] = [];
      for (const subject of subjects) {
        for (const student of students) {
          tasks.push(
            subjectService.enrollStudent(careerId, subject.id, student.id)
          );
        }
      }

      // Ejecutar en lotes para evitar saturar el backend
      const chunkSize = 25;
      for (let i = 0; i < tasks.length; i += chunkSize) {
        const chunk = tasks.slice(i, i + chunkSize);
        await Promise.allSettled(chunk);
      }

      toast.success("Estudiantes inscritos en todas las asignaturas.");

      // Invalidar caches relevantes
      queryClient.invalidateQueries({
        queryKey: ["technical-career", careerId],
      });
      for (const subject of subjects) {
        queryClient.invalidateQueries({
          queryKey: ["subject", subject.id, careerId],
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Ocurrió un error al inscribir en todas las asignaturas.");
    } finally {
      setIsEnrollingAll(false);
    }
  };

  return {
    isEnrollingAll,
    enrollAllImportedIntoAllSubjects,
  };
}
