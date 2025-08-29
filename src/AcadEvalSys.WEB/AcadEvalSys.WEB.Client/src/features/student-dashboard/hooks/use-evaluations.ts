import { useEffect, useState } from "react";
import {
  studentEvaluationsApi,
  StudentCompetencyEvaluation,
} from "../api/student-evaluations-api";

export function useEvaluations(evaluationInstanceId?: string) {
  const [evaluations, setEvaluations] = useState<StudentCompetencyEvaluation[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    if (!evaluationInstanceId) {
      setEvaluations([]);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await studentEvaluationsApi.getEvaluations(
          evaluationInstanceId
        );
        if (mounted) setEvaluations(data);
      } catch (err) {
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [evaluationInstanceId]);

  return { evaluations, loading, error };
}
