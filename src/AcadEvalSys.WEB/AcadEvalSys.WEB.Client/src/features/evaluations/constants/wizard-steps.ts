import { WizardStep } from "../models/evaluation-form";

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Información Básica",
    description:
      "Define el nombre, descripción, semestre y fechas de la evaluación",
  },
  {
    id: 2,
    title: "Asignación de Competencias",
    description: "Asigna competencias a asignaturas y profesores",
  },
  {
    id: 3,
    title: "Revisión",
    description: "Revisa y confirma la evaluación",
  },
];
