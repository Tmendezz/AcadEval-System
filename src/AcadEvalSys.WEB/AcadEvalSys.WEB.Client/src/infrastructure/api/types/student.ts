import { CareerYear } from "./enums";

export interface Student {
  id: string;
  name: string;
  email: string;
  currentYear: CareerYear;
  technicalCareerName: string;
}
