export type CompetencyLevel = "Inicial" | "Intermedio" | "Avanzado" | "Excelente";

export function getNivelColor(nivel?: string) {
  switch (nivel) {
    case "Inicial":
      return "bg-red-500";
    case "Intermedio":
      return "bg-yellow-500";
    case "Avanzado":
      return "bg-blue-500";
    case "Excelente":
      return "bg-green-500";
    default:
      return "bg-muted";
  }
}

export function getNivelBadgeVariant(nivel?: string) {
  switch (nivel) {
    case "Inicial":
      return "destructive" as const;
    case "Intermedio":
      return "secondary" as const;
    case "Avanzado":
    case "Excelente":
      return "default" as const;
    default:
      return "outline" as const;
  }
}


