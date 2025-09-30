import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { User, UserPlus, X } from "lucide-react";
import { useCareerCoordinator, useCoordinatorOperations } from "../hooks/use-coordinator-operations";
import { useGetUsers } from "@/features/administration/hooks/use-get-users";
import { UserListItem } from "@/features/administration/services/identity-admin-service";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";

interface CoordinatorCardProps {
  careerId: string;
}

export function CoordinatorCard({ careerId }: CoordinatorCardProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: coordinator, isLoading: isLoadingCoordinator, error: coordinatorError } = useCareerCoordinator(careerId);
  const { data: usersData } = useGetUsers();
  const { assignCoordinator, removeCoordinator } = useCoordinatorOperations(careerId);

  const users: UserListItem[] = usersData?.items || [];

  const handleAssignCoordinator = async () => {
    if (!selectedUserId) return;
    
    await assignCoordinator.mutateAsync(selectedUserId);
    setIsAssignDialogOpen(false);
    setSelectedUserId("");
  };

  const handleRemoveCoordinator = async () => {
    await removeCoordinator.mutateAsync();
  };

  if (isLoadingCoordinator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coordinador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (coordinatorError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coordinador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-red-600 mb-4">
              Error al cargar información del coordinador
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coordinator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coordinador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              No hay un coordinador asignado a esta carrera.
            </p>
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Asignar Coordinador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Asignar Coordinador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Seleccionar Usuario</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Seleccione un profesor como coordinador de la carrera
                    </p>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user: UserListItem) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAssignCoordinator}
                      disabled={!selectedUserId || assignCoordinator.isPending}
                    >
                      {assignCoordinator.isPending ? "Asignando..." : "Asignar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  const initials = coordinator.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordinador</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://unavatar.io/${coordinator.email}`} alt={coordinator.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{coordinator.name}</p>
            <p className="text-sm text-muted-foreground">{coordinator.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Cambiar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar Coordinador</DialogTitle>
              </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Seleccionar Nuevo Usuario</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Seleccione un profesor como coordinador de la carrera
                    </p>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter((u: UserListItem) => u.id !== coordinator.userId).map((user: UserListItem) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAssignCoordinator}
                    disabled={!selectedUserId || assignCoordinator.isPending}
                  >
                    {assignCoordinator.isPending ? "Asignando..." : "Cambiar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <ConfirmDialog
            title="Remover Coordinador"
            description={`¿Estás seguro de que quieres remover a ${coordinator.name} como coordinador de esta carrera?`}
            confirmText="Remover"
            cancelText="Cancelar"
            onConfirm={handleRemoveCoordinator}
            trigger={
              <Button variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}