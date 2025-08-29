import { LogOut, User } from "lucide-react";
import { AvatarDropdown } from "./avatar-dropdown";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks/use-login";

export function UserDropdown() {
  const { user } = useAuthStore();
  const { logout, isLoading } = useLogout();

  // Mantén el logout existente o usa el nuevo
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [logout]);

  if (!user) return null;

  return (
    <AvatarDropdown user={user}>
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Mi Cuenta</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
        <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          {isLoading ? "Cerrando..." : "Cerrar Sesión"}
        </span>
      </DropdownMenuItem>
    </AvatarDropdown>
  );
}
