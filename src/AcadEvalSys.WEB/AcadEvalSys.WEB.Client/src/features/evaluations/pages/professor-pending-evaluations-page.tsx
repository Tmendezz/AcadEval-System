import { useEffect } from "react";
import { navigate } from "wouter/use-browser-location";

export default function ProfessorPendingEvaluationsPage() {
  useEffect(() => {
    // Redirigir a la página principal de evaluaciones
    navigate("/evaluaciones/mis-evaluaciones");
  }, []);

  // No renderizar nada mientras se redirige
  return null;
}
