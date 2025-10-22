import { create } from "zustand";

interface FormData {
  [key: string]: unknown;
}

interface FormState {
  evaluationForm: FormData;
  competencyForm: FormData;
  subjectForm: FormData;
  careerForm: FormData;

  updateForm: (formType: string, data: FormData) => void;
  setFormField: (formType: string, field: string, value: unknown) => void;
  clearForm: (formType: string) => void;
  clearAllForms: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  evaluationForm: {},
  competencyForm: {},
  subjectForm: {},
  careerForm: {},

  updateForm: (formType: string, data: FormData) =>
    set((state) => ({
      [formType]: { ...state[formType as keyof FormState], ...data },
    })),

  setFormField: (formType: string, field: string, value: unknown) =>
    set((state) => ({
      [formType]: {
        ...state[formType as keyof FormState],
        [field]: value,
      },
    })),

  clearForm: (formType: string) =>
    set(() => ({
      [formType]: {},
    })),

  clearAllForms: () =>
    set({
      evaluationForm: {},
      competencyForm: {},
      subjectForm: {},
      careerForm: {},
    }),
}));
