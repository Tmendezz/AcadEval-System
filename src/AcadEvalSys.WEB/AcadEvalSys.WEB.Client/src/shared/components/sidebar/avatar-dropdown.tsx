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
  useSidebar,
} from "@/shared/components/ui/sidebar";

import { cn } from "@/shared/lib/cn";

interface AvatarDropdownProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
    initials?: string;
    avatarUrl?: string;
  };
  children: React.ReactNode;
  className?: string;
}

export function AvatarDropdown({
  user,
  children,
  className,
}: AvatarDropdownProps) {
  const { isMobile } = useSidebar();

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
            <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
              <AvatarImage
                src={user.avatarUrl || "/placeholder.svg?height=32&width=32"}
                alt={user.email || "Usuario"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.initials || "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm min-w-0">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.role}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
                <AvatarImage
                  src={user.avatarUrl || "/placeholder.svg?height=32&width=32"}
                  alt={user.email || "Usuario"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.initials || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.role}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
