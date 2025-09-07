"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserListItem } from "@infrastructure/api/clients/identity-admin-service";
import { Badge } from "@/shared/components/ui/badge";

export const userColumns: ColumnDef<UserListItem>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.roles.map(role => (
          <Badge key={role} variant="secondary">{role}</Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "isLockedOut",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.original.isLockedOut ? "destructive" : "success"}>
        {row.original.isLockedOut ? "Bloqueado" : "Activo"}
      </Badge>
    ),
  },
];
