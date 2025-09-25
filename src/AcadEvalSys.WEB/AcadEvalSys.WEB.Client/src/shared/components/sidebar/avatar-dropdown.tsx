import React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/components/ui/sidebar";
import { cn } from "@infrastructure/lib/cn";
import { getUserInitials } from "@infrastructure/lib/utils";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { User, UserRole, getFirstRole } from "@/features/auth/models";

interface AvatarDropdownProps {
  user: User;
  children: React.ReactNode;
  className?: string;
}

// Componente reutilizable para el avatar
function UserAvatar({
  user,
  size = "default",
}: {
  user: User;
  size?: "default" | "small";
}) {
  const sizeClasses = {
    default: "h-8 w-8",
    small: "h-6 w-6",
  };

  return (
    <Avatar className={cn("rounded-lg flex-shrink-0", sizeClasses[size])}>
      <AvatarImage
        src={ "/placeholder.svg?height=32&width=32"}
        alt={user.email || "Usuario"}
      />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getUserInitials(user.name || "")}
      </AvatarFallback>
    </Avatar>
  );
}

// Componente reutilizable para la información del usuario
function UserInfo({
  user,
  variant = "default",
}: {
  user: User;
  variant?: "default" | "compact";
}) {
  const isCompact = variant === "compact";

  function getFirstRoleLabel(user: User): React.ReactNode {
    const role = getFirstRole(user);
    if (!role) return "Sin rol";
    const labels: Record<UserRole, string> = {
      [UserRole.Admin]: "Administrador",
      [UserRole.Coordinator]: "Coordinador",
      [UserRole.Professor]: "Profesor",
      [UserRole.Student]: "Estudiante",
    };
    return labels[role];
  }

  return (
    <div
      className={cn(
        "flex flex-col items-start text-xs min-w-0",
        isCompact && "grid flex-1 text-left text-sm leading-tight"
      )}
    >
      <span className="truncate font-xs">{user.name}</span>
      <span className="truncate text-xs text-muted-foreground">
        {getFirstRoleLabel(user)}
      </span>
    </div>
  );
}

export function AvatarDropdown({
  user,
  children,
  className,
}: AvatarDropdownProps) {
  const { isMobile } = useSidebar();
  const dropdownProps = {
    side: (isMobile ? "bottom" : "right") as "bottom" | "right",
    align: "end" as const,
    sideOffset: 4,
  };
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className={cn(
              "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full truncate cursor-pointer",
              className
            )}
          >
            <UserAvatar user={user} />
            <UserInfo variant="compact" user={user} />
            <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 rounded-lg" {...dropdownProps}>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserAvatar user={user} size="small" />
              <UserInfo user={user} variant="compact" />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
