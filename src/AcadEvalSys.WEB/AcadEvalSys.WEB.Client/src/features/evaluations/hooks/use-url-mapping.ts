export function useUrlMapping() {
  // Función para convertir slug de carrera a nombre completo
  const getCareerNameFromSlug = (slug: string) => {
    // Mapeo simple - en producción esto debería venir de la base de datos
    const careerMappings: { [key: string]: string } = {
      "desarrollo-de-software": "Desarrollo de Software",
      "ingenieria-en-sistemas": "Ingeniería en Sistemas",
      "tecnico-en-programacion": "Técnico en Programación",
      // Agregar más mapeos según sea necesario
    };
    return (
      careerMappings[slug] ||
      slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  // Función para convertir slug de año a formato backend
  const getYearFromSlug = (slug: string) => {
    const yearMappings: { [key: string]: string } = {
      primero: "First",
      segundo: "Second",
      tercero: "Third",
    };
    return yearMappings[slug] || slug;
  };

  return {
    getCareerNameFromSlug,
    getYearFromSlug,
  };
}