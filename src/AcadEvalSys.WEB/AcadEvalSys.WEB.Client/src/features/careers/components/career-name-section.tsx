import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";

interface CareerNameSectionProps {
  name: string;
  onNameChange: (name: string) => void;
}

export function CareerNameSection({
  name,
  onNameChange,
}: CareerNameSectionProps) {
  return (
    <Card className="p-4 space-y-3">
      <label className="text-sm font-medium">Nombre de la carrera</label>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Ej: Tecnicatura en Programación"
      />
    </Card>
  );
}
