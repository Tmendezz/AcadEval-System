import { CompetencyLevel } from "./competency-level";

export interface CompetencyDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  levels: CompetencyLevel[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
