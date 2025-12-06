import { api } from "@infrastructure/query/axios";
import {
  StudentCompetencyEvaluation,
  StudentEvaluationInstance,
  ReportDownloadUrl,
  StudentReceivedEvaluation,
} from "../models";

const STUDENT_EVALUATIONS_API_URL = "/student-evaluations";

export const studentEvaluationsApi = {
  async getReceivedEvaluations(): Promise<StudentReceivedEvaluation[]> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/received-evaluations`;
    const { data } = await api.get<StudentReceivedEvaluation[]>(url);
    return data;
  },

  async getEvaluationInstances(): Promise<StudentEvaluationInstance[]> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/evaluation-instances`;
    const { data } = await api.get<StudentEvaluationInstance[]>(url);
    return data;
  },

  async getEvaluations(
    evaluationInstanceId: string
  ): Promise<StudentCompetencyEvaluation[]> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/evaluation-instances/${evaluationInstanceId}/evaluations`;
    const { data } = await api.get<StudentCompetencyEvaluation[]>(url);
    return data;
  },

  async getAllEvaluations(): Promise<StudentCompetencyEvaluation[]> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/evaluations`;
    const { data } = await api.get<StudentCompetencyEvaluation[]>(url);
    return data;
  },

  async getReportDownloadUrl(reportId: string): Promise<ReportDownloadUrl> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/reports/${reportId}/download-url`;
    const { data } = await api.get<ReportDownloadUrl>(url);
    return data;
  },

  async downloadReport(reportId: string): Promise<Blob> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/reports/${reportId}/download`;
    const { data } = await api.get(url, { responseType: "blob" });
    return data;
  },
};
