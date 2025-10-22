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

/**
 * Convierte el enum CareerYear a su valor numérico
 * @param careerYear - El año de carrera
 * @returns El número del año (1, 2, 3)
 */
export function careerYearToNumber(careerYear: CareerYear): number {
  return careerYear;
}

/**
 * Convierte el enum CareerYear a su representación en español
 * @param careerYear - El año de carrera
 * @returns El año en español (Primero, Segundo, Tercero)
 */
export function careerYearToSpanishString(careerYear: CareerYear): string {
  const yearMapping: Record<CareerYear, string> = {
    [CareerYear.First]: "Primero",
    [CareerYear.Second]: "Segundo",
    [CareerYear.Third]: "Tercero",
  };

  return yearMapping[careerYear] || careerYear.toString();
}

/**
 * Convierte el enum CareerYear a su representación con ordinal
 * @param careerYear - El año de carrera
 * @returns El año con ordinal (1°, 2°, 3°)
 */
export function careerYearToOrdinalString(careerYear: CareerYear): string {
  return `${careerYearToNumber(careerYear)}°`;
}
