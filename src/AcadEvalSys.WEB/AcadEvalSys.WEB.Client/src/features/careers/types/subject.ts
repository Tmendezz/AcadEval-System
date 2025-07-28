import {
  Subject,
  EnrolledStudent,
  SubjectAssignment,
  CareerYearData,
  CareerData,
  Professor as SharedProfessor,
  Student,
} from "@/shared/types";

export type Professor = Omit<SharedProfessor, "technicalCareerId">;

export type { EnrolledStudent, SubjectAssignment, CareerYearData, CareerData };
