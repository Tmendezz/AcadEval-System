import { LogOut, User } from "lucide-react";
import { AvatarDropdown } from "./avatar-dropdown";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/features/auth/store";


export function UserDropdown() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, user } = useAuthStore();

  // Mantén el logout existente o usa el nuevo
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // El nuevo store se actualizará automáticamente via interceptors
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

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
          {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
        </span>
      </DropdownMenuItem>
    </AvatarDropdown>
  );
}
