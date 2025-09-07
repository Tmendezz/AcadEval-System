import { api } from "@infrastructure/query/axios";
import type {
  TechnicalCareer,
  CreateTechnicalCareerRequest,
  UpdateTechnicalCareerRequest,
} from "@infrastructure/api/types/technical-career";

const TECHNICAL_CAREERS_API_URL = "/technical-careers";

export const getTechnicalCareers = async (): Promise<TechnicalCareer[]> => {
  const { data } = await api.get<TechnicalCareer[]>(TECHNICAL_CAREERS_API_URL);
  return data;
};

export const getTechnicalCareerById = async (
  id: string
): Promise<TechnicalCareer> => {
  const { data } = await api.get<TechnicalCareer>(
    `${TECHNICAL_CAREERS_API_URL}/${id}`
  );
  return data;
};

export const createTechnicalCareer = async (
  career: CreateTechnicalCareerRequest
): Promise<string> => {
  const response = await api.post(TECHNICAL_CAREERS_API_URL, career, {
    validateStatus: (s) => s >= 200 && s < 400,
  });

  const location = (response.headers["location"] ||
    response.headers["Location"]) as string | undefined;
  if (location) {
    const parts = location.split("/");
    const id = parts[parts.length - 1];
    return id;
  }

  // Si no viene Location, intentamos leer un posible cuerpo { id }
  const maybeId = (response.data as { id?: string })?.id as string | undefined;
  if (maybeId) return maybeId;

  throw new Error("No se pudo obtener el ID de la tecnicatura creada");
};

export const updateTechnicalCareer = async (
  id: string,
  career: UpdateTechnicalCareerRequest
): Promise<void> => {
  await api.put(`${TECHNICAL_CAREERS_API_URL}/${id}`, career);
};

export const deleteTechnicalCareer = async (id: string): Promise<void> => {
  await api.delete(`${TECHNICAL_CAREERS_API_URL}/${id}`);
};

export const assignCareerCoordinator = async (
  careerId: string,
  coordinatorUserId: string
): Promise<void> => {
  await api.put(`${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`, {
    userId: coordinatorUserId,
  });
};

export const getCareerCoordinator = async (
  careerId: string
): Promise<{
  userId: string;
  name: string;
  email: string;
  phone: string;
} | null> => {
  try {
    const { data } = await api.get(
      `${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`
    );
    return data;
  } catch {
    // Si no hay coordinador asignado, retornar null
    return null;
  }
};

export const removeCareerCoordinator = async (
  careerId: string
): Promise<void> => {
  await api.delete(`${TECHNICAL_CAREERS_API_URL}/${careerId}/coordinator`);
};

// Importación masiva de estudiantes a nivel de carrera
export interface ImportStudentsResult {
  usersCreated: number;
  studentsEnrolled: number;
  studentsAlreadyEnrolled: number;
  errors: string[];
  generatedPasswords: { email: string; password: string }[];
}

export const importStudents = async (
  careerId: string,
  file: File
): Promise<ImportStudentsResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ImportStudentsResult>(
    `${TECHNICAL_CAREERS_API_URL}/${careerId}/import-students`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
