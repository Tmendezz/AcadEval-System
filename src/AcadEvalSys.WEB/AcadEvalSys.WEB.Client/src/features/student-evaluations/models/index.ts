export interface StudentCompetencyEvaluation {
    studentCompetencyAssessmentId: string;
    studentName: string;
    studentEmail: string;
    competencyLevelDescription: string;
    competencyLevel: string;
    status: string;
  }
  
  export interface StudentReceivedEvaluation {
    id: string;
    competencyName: string;
    subjectName: string;
    careerName: string;
    year: string;
    professorName: string;
    status: "Pending" | "Completed";
    competencyLevel?:
      | "Inicial"
      | "Intermedio"
      | "Avanzado"
      | "Excelente"
      | "Ninguno";
    assessmentDate?: string;
    dueDate?: string;
    observations?: string | null;
    evaluationInstanceTitle: string;
    evaluationInstanceDescription: string;
  reportId?: string | null;
  }
  
  export interface StudentEvaluationInstance {
    id: string;
    title: string;
    description: string;
    periodFrom: string;
    periodTo: string;
    status: string;
    semester: string;
    totalCompetencies: number;
    completedCompetencies: number;
    progressPercentage: number;
    hasReport: boolean;
    reportId?: string;
  }
  
  export interface ReportDownloadUrl {
    reportId: string;
    downloadUrl: string;
    expiresAt: string;
    fileName: string;
  }
  