import { DataSection } from "@/shared/components/ui/data-section";
import { userColumns } from "./user-columns";
import { UserListItem } from "../services/identity-admin-service";

interface UserListProps {
  users: UserListItem[];
  isLoading: boolean;
}

export function UserList({ users, isLoading }: UserListProps) {
  return (
    <DataSection
      title="Lista de Usuarios"
      description="Usuarios del sistema con sus roles."
      data={users}
      columns={userColumns}
      isLoading={isLoading}
      emptyMessage="No se encontraron usuarios."
    />
  );
}
