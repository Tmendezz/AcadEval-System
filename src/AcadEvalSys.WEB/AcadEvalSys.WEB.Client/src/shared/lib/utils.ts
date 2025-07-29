export const nameToSlug = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, "-");

export const roleToText = (role: string) => {
  switch (role) {
    case "Admin":
      return "Administrador";
    case "Professor":
      return "Docente";
    case "Student":
      return "Alumno";
    case "Coordinator":
      return "Coordinador";
    default:
      return role;
  }
};

export const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};
