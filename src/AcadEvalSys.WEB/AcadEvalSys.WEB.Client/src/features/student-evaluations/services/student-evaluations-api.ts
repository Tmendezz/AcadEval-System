import { api } from "@infrastructure/query/axios";
import {
  StudentCompetencyEvaluation,
  StudentEvaluationInstance,
  ReportDownloadUrl,
} from "../models";

const STUDENT_EVALUATIONS_API_URL = "/api/student-evaluations";

export const studentEvaluationsApi = {
  async getEvaluationInstances(): Promise<StudentEvaluationInstance[]> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/evaluation-instances`;
    console.log("🌐 API: Llamando a:", url);
    const { data } = await api.get<StudentEvaluationInstance[]>(url);
    console.log("📡 API: Respuesta recibida de:", url);
    return data;
  },

  async getEvaluations(
    evaluationInstanceId: string
  ): Promise<StudentCompetencyEvaluation[]> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/evaluation-instances/${evaluationInstanceId}/evaluations`;
    console.log("🌐 API: Llamando a:", url);
    const { data } = await api.get<StudentCompetencyEvaluation[]>(url);
    console.log("📡 API: Respuesta recibida de:", url);
    return data;
  },

  async getAllEvaluations(): Promise<StudentCompetencyEvaluation[]> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/evaluations`;
    console.log("🌐 API: Llamando a:", url);
    const { data } = await api.get<StudentCompetencyEvaluation[]>(url);
    console.log("📡 API: Respuesta recibida de:", url);
    return data;
  },

  async getReportDownloadUrl(reportId: string): Promise<ReportDownloadUrl> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/reports/${reportId}/download-url`;
    console.log("🌐 API: Llamando a:", url);
    const { data } = await api.get<ReportDownloadUrl>(url);
    console.log("📡 API: Respuesta recibida de:", url);
    return data;
  },

  async downloadReport(reportId: string): Promise<Blob> {
    const url = `${STUDENT_EVALUATIONS_API_URL}/reports/${reportId}/download`;
    console.log("🌐 API: Llamando a:", url);
    const { data } = await api.get(url, { responseType: "blob" });
    console.log("📡 API: Respuesta recibida de:", url);
    return data;
  },
};
