import { useEffect, useState } from "react";
import {
  studentEvaluationsApi,
  StudentEvaluationInstance,
} from "../api/student-evaluations-api";

export function useEvaluationInstances() {
  const [instances, setInstances] = useState<StudentEvaluationInstance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        console.log("🔍 Hook: Llamando a getEvaluationInstances...");
        const data = await studentEvaluationsApi.getEvaluationInstances();
        console.log("✅ Hook: Datos recibidos:", data);
        if (mounted) setInstances(data);
      } catch (err) {
        console.error("❌ Hook: Error en getEvaluationInstances:", err);
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { instances, loading, error };
}
