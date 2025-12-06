// Enums locales del feature de carreras

export enum CareerYear {
  First = 1,
  Second = 2,
  Third = 3,
}

export function getCareerYearLabel(year: CareerYear): string {
  const n = Number(year);
  return `${n}º Año`;
}


