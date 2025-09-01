import { useParams } from "wouter";
import { useEvaluateStudents } from "./use-evaluate-students";

export const useEvaluationPageState = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const evaluationState = useEvaluateStudents(assignmentId || "");

  return {
    assignmentId,
    ...evaluationState,
  };
};
