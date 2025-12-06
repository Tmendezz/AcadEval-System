import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function FormatHelpSection() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Formato requerido</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            El archivo Excel debe tener las siguientes columnas:
          </p>
          <div className="bg-muted p-3 rounded font-mono text-sm">
            EMAIL | NOMBRE COMPLETO
            <br />
            juan.perez@ejemplo.com | Juan Pérez
            <br />
            maria.gonzalez@ejemplo.com | María González
            <br />
            carlos.rodriguez@ejemplo.com | Carlos Rodríguez
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • <strong>email:</strong> Email único del estudiante (requerido)
            </li>
            <li>
              • <strong>name:</strong> Nombre completo (requerido)
            </li>
            <li>
              • <strong>current_year:</strong> Año actual del estudiante (First,
              Second, Third) - se asigna automáticamente desde la UI
            </li>
            <li>
              • <strong>password:</strong> Contraseña opcional (se genera
              automáticamente si se omite)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
