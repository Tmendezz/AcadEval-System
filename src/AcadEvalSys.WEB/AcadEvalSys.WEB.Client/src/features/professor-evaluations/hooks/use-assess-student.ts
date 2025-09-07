import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessStudent } from "../services";
import { StudentAssessmentRequest } from "../models";

export const useAssessStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessment: StudentAssessmentRequest) => {
      await assessStudent(assessment.assignmentId, assessment.studentId, {
        competencyLevel: assessment.competencyLevel,
        comments: assessment.observations,
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["assignment-students"],
      });
      queryClient.invalidateQueries({
        queryKey: ["professor-assignments"],
      });
    },
  });
};

export const useUpdateStudentAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      assignmentId: string;
      studentId: string;
      assessment: {
        competencyLevel: string;
        observations?: string;
      };
    }) => {
      await assessStudent(params.assignmentId, params.studentId, {
        competencyLevel: params.assessment.competencyLevel,
        comments: params.assessment.observations,
      });
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["assignment-students"],
      });
      queryClient.invalidateQueries({
        queryKey: ["professor-assignments"],
      });
    },
  });
};
