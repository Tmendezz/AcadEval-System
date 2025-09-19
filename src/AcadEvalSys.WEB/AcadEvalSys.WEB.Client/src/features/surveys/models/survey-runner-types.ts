export type RunnerQuestionType = "single" | "multi" | "text";

export interface SurveyOption {
  value: number;
  text: string;
}

export interface FixedQuestion {
  id: string;
  text: string;
  type: RunnerQuestionType;
  options?: SurveyOption[];
  allowComment?: boolean;
}

// Vista de alumno: un bloque por docente/asignatura
export interface StudentSurveyTarget {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
}

// Vista de docente: un bloque por alumno/asignatura
export interface TeacherSurveyTarget {
  subjectId: string;
  subjectName: string;
  studentId: string;
  studentName: string;
}


