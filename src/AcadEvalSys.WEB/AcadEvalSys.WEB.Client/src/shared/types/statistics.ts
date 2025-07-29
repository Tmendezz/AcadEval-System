import { CareerYear } from "./enums";

export interface BaseStatistics {
  totalStudents: number;
  totalProfessors: number;
}

export interface AdminStatistics extends BaseStatistics {
  totalCareers: number;
  totalYears: number;
}

export interface CareerStatistics extends BaseStatistics {
  id: string;
  name: string;
  fullName: string;
}

export interface YearStatistics {
  value: CareerYear;
  label: string;
  count: number;
  active: boolean;
}
