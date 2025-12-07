import { LogOut, User, Construction } from "lucide-react";
import { AvatarDropdown } from "./avatar-dropdown";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks/use-login";

export function UserDropdown() {
  const { user } = useAuthStore();
  const { logout, isLoading } = useLogout();
  const [showUnderDevelopmentDialog, setShowUnderDevelopmentDialog] = useState(false);

  // Mantén el logout existente o usa el nuevo
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Silently handle logout errors
    }
  }, [logout]);

  const handleMyAccountClick = useCallback(() => {
    setShowUnderDevelopmentDialog(true);
  }, []);

  if (!user) return null;

  return (
    <>
      <AvatarDropdown user={user}>
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={handleMyAccountClick}>
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

      <Dialog open={showUnderDevelopmentDialog} onOpenChange={setShowUnderDevelopmentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Construction className="h-5 w-5 text-orange-500" />
              <DialogTitle>Funcionalidad en Desarrollo :C</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              La sección de "Mi Cuenta" está actualmente en desarrollo.
              Dentro de poco vas a poder gestionar tu perfil, cambiar tu contraseña y actualizar tus preferencias.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
