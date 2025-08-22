import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assessStudent,
  updateStudentAssessment,
} from "../../services/professor-evaluation-service";
import { StudentAssessmentRequest } from "../../types/professor-evaluation";
import { studentsForAssignmentKeys } from "./use-students-for-assignment";
import { professorAssignmentsKeys } from "./use-professor-assignments";

export const useAssessStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessment: StudentAssessmentRequest) =>
      assessStudent(assessment),
    onSuccess: (data, variables) => {
      // Invalidate and refetch students for this assignment
      queryClient.invalidateQueries({
        queryKey: studentsForAssignmentKeys.byAssignment(
          variables.assignmentId
        ),
      });

      // Invalidate and refetch professor assignments to update progress
      queryClient.invalidateQueries({
        queryKey: professorAssignmentsKeys.all,
      });
    },
  });
};

export const useUpdateStudentAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      studentId,
      assessment,
    }: {
      assignmentId: string;
      studentId: string;
      assessment: Partial<StudentAssessmentRequest>;
    }) => updateStudentAssessment(assignmentId, studentId, assessment),
    onSuccess: (data, variables) => {
      // Invalidate and refetch students for this assignment
      queryClient.invalidateQueries({
        queryKey: studentsForAssignmentKeys.byAssignment(
          variables.assignmentId
        ),
      });

      // Invalidate and refetch professor assignments to update progress
      queryClient.invalidateQueries({
        queryKey: professorAssignmentsKeys.all,
      });
    },
  });
};
