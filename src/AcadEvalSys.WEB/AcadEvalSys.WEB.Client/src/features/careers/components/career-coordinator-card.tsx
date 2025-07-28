import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";
import { UserCheck, UserPlus, Users, GraduationCap } from "lucide-react";

interface Coordinator {
  id: string;
  name: string;
  email: string;
}

interface Professor {
  id: string;
  name: string;
  email: string;
}

interface CareerCoordinatorCardProps {
  careerName: string;
  coordinator?: Coordinator;
  professors: Professor[];
  onAssignCoordinator: (professorId: string) => Promise<void>;
}

export function CareerCoordinatorCard({
  careerName,
  coordinator,
  professors,
  onAssignCoordinator,
}: CareerCoordinatorCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignCoordinator = async () => {
    if (!selectedProfessor) return;

    setIsLoading(true);
    try {
      await onAssignCoordinator(selectedProfessor);
      setIsDialogOpen(false);
      setSelectedProfessor("");
    } catch (error) {
      console.error("Error assigning coordinator:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium leading-none tracking-tight">
              Coordinador
            </span>
            <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="h-2.5 w-2.5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {coordinator ? coordinator.name : "Sin asignar"}
          </div>
          <p className="text-xs text-muted-foreground">
            {coordinator ? coordinator.email : "Asigna un profesor"}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {coordinator ? "Cambiar Coordinador" : "Asignar Coordinador"}
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Coordinador</DialogTitle>
            <DialogDescription>
              Selecciona un profesor para asignar como coordinador de{" "}
              {careerName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="professor">Profesor</Label>
              <Select
                value={selectedProfessor}
                onValueChange={setSelectedProfessor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un profesor" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {professor.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAssignCoordinator}
              disabled={!selectedProfessor || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Asignando...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Asignar Coordinador
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
