import { NavItem } from "@/shared/types/ui";
import { NavMenuItem } from "./nav-menu-item";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "../ui/sidebar";

interface SidebarNavGroupProps {
  title: string;
  items: NavItem[];
  className?: string;
  currentPath: string;
}

export function SidebarNavGroup({
  title,
  items,
  className,
  currentPath,
}: SidebarNavGroupProps) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMenuItem
            key={item.href}
            item={item}
            isActive={currentPath === item.href}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
