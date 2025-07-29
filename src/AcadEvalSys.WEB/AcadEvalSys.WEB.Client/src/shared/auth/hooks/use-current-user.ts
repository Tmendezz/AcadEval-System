import { getUserInitials, roleToText } from "@/shared/lib/utils";
import { useUser } from "../stores/auth-store";

/**
 * Hook simple para obtener información del usuario actual
 */
export const useCurrentUser = () => {
  const user = useUser();

  return {
    user,
    initials: user?.name ? getUserInitials(user.name) : "",
    role: user?.roles[0] ? roleToText(user.roles[0]) : "",
  };
};
