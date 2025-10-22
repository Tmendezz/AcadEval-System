import { format, parseISO, isValid } from 'date-fns';

/**
 * Convierte una fecha en formato datetime-local (YYYY-MM-DDTHH:mm) al formato ISO string
 * que espera el backend para campos DateTime en C#.
 * 
 * @param dateTimeLocal - Fecha en formato datetime-local del input HTML
 * @returns String en formato ISO 8601 o undefined si la fecha es inválida/vacía
 * 
 * @example
 * convertDateTimeLocalToISO("2025-09-16T10:30") // "2025-09-16T10:30:00.000Z"
 * convertDateTimeLocalToISO("") // undefined
 * convertDateTimeLocalToISO("invalid") // undefined
 */
export function convertDateTimeLocalToISO(dateTimeLocal: string): string | undefined {
  if (!dateTimeLocal || !dateTimeLocal.trim()) {
    return undefined;
  }
  
  try {
    // El formato datetime-local es "YYYY-MM-DDTHH:mm"
    // Crear un objeto Date interpretando como hora local
    const date = new Date(dateTimeLocal);
    
    // Verificar que la fecha sea válida
    if (!isValid(date)) {
      console.warn('Invalid date provided:', dateTimeLocal);
      return undefined;
    }
    
    // Convertir a ISO string (UTC)
    return date.toISOString();
  } catch (error) {
    console.error('Error converting datetime-local to ISO:', error);
    return undefined;
  }
}

/**
 * Convierte una fecha ISO string a formato datetime-local para inputs HTML.
 * 
 * @param isoString - Fecha en formato ISO 8601
 * @returns String en formato datetime-local (YYYY-MM-DDTHH:mm) o string vacío si es inválida
 * 
 * @example
 * convertISOToDateTimeLocal("2025-09-16T10:30:00.000Z") // "2025-09-16T10:30"
 * convertISOToDateTimeLocal("invalid") // ""
 */
export function convertISOToDateTimeLocal(isoString: string): string {
  if (!isoString || !isoString.trim()) {
    return '';
  }
  
  try {
    const date = parseISO(isoString);
    
    if (!isValid(date)) {
      console.warn('Invalid ISO date provided:', isoString);
      return '';
    }
    
    // Formatear a YYYY-MM-DDTHH:mm (formato datetime-local)
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error('Error converting ISO to datetime-local:', error);
    return '';
  }
}

/**
 * Formatea una fecha para mostrar al usuario en español.
 * 
 * @param dateInput - Fecha como string ISO, Date object, o datetime-local
 * @param includeTime - Si incluir la hora en el formato
 * @returns Fecha formateada para mostrar al usuario
 * 
 * @example
 * formatDateForDisplay("2025-09-16T10:30:00.000Z") 
 * // "lunes, 16 de septiembre de 2025 a las 10:30"
 * 
 * formatDateForDisplay("2025-09-16T10:30:00.000Z", false) 
 * // "lunes, 16 de septiembre de 2025"
 */
export function formatDateForDisplay(
  dateInput: string | Date, 
  includeTime: boolean = true
): string {
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    
    if (!isValid(date)) {
      return 'Fecha inválida';
    }
    
    if (includeTime) {
      return date.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return 'Fecha inválida';
  }
}
