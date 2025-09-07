// Servicios específicos del módulo de careers
export * from "./technical-career-service";

// Servicios globales (re-export para compatibilidad)
export { professorService } from "@infrastructure/api/clients/professor-service";
export { studentService } from "@infrastructure/api/clients/student-service";
