export enum CareerYear {
  First = 1,
  Second = 2,
  Third = 3,
}

export const CareerYearLabels: Record<CareerYear, string> = {
  [CareerYear.First]: "1° Año",
  [CareerYear.Second]: "2° Año",
  [CareerYear.Third]: "3° Año",
};
