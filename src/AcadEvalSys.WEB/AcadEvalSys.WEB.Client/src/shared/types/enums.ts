export enum CareerYear {
  First = 1,
  Second = 2,
  Third = 3,
}

export const CareerYearLabels: Record<CareerYear, string> = {
  [CareerYear.First]: "Primer Año",
  [CareerYear.Second]: "Segundo Año",
  [CareerYear.Third]: "Tercer Año",
};
