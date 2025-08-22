import { CareerYear } from "../types/enums";

/**
 * Mapea el string del enum CareerYear al número correspondiente
 * @param yearString - String del enum ("First", "Second", "Third")
 * @returns Número del año (1, 2, 3) o undefined si no es válido
 */
export function mapCareerYearStringToNumber(
  yearString: string
): CareerYear | undefined {
  const yearMapping: Record<string, CareerYear> = {
    First: CareerYear.First, // 1
    Second: CareerYear.Second, // 2
    Third: CareerYear.Third, // 3
    "1": CareerYear.First, // 1 (por si acaso)
    "2": CareerYear.Second, // 2 (por si acaso)
    "3": CareerYear.Third, // 3 (por si acaso)
  };

  return yearMapping[yearString];
}

/**
 * Mapea el número del enum CareerYear al string correspondiente
 * @param yearNumber - Número del año (1, 2, 3)
 * @returns String del enum ("First", "Second", "Third") o undefined si no es válido
 */
export function mapCareerYearNumberToString(
  yearNumber: CareerYear
): string | undefined {
  const yearMapping: Record<CareerYear, string> = {
    [CareerYear.First]: "First", // 1 -> "First"
    [CareerYear.Second]: "Second", // 2 -> "Second"
    [CareerYear.Third]: "Third", // 3 -> "Third"
  };

  return yearMapping[yearNumber];
}

/**
 * Verifica si un string es un año válido de carrera
 * @param yearString - String a verificar
 * @returns true si es válido, false si no
 */
export function isValidCareerYearString(yearString: string): boolean {
  return mapCareerYearStringToNumber(yearString) !== undefined;
}

/**
 * Obtiene el año por defecto (First = 1)
 * @returns CareerYear.First
 */
export function getDefaultCareerYear(): CareerYear {
  return CareerYear.First;
}
