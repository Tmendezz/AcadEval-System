import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { User } from "lucide-react";

interface Coordinator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface CoordinatorCardProps {
  coordinator?: Coordinator | null;
}

export function CoordinatorCard({ coordinator }: CoordinatorCardProps) {
  if (!coordinator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coordinador</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay un coordinador asignado a esta carrera.
          </p>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${coordinator.firstName} ${coordinator.lastName}`;
  const initials = `${coordinator.firstName[0]}${coordinator.lastName[0]}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordinador</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://unavatar.io/${coordinator.email}`} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">{fullName}</p>
          <p className="text-sm text-muted-foreground">{coordinator.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
