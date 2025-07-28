import { usePathname } from "wouter/use-browser-location";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";

import {
  SidebarBrand,
  SidebarNavGroup,
  UserDropdown,
  useSidebarConfig,
} from "@/shared/components/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const sidebarConfig = useSidebarConfig();

  return (
    <Sidebar className="overflow-x-hidden">
      <SidebarBrand />

      <SidebarContent className="p-0">
        {Object.entries(sidebarConfig).map(([key, section], index) => (
          <div key={key}>
            {index > 0 && <SidebarSeparator className="mx-0 my-2 w-full" />}

            <SidebarNavGroup
              title={section.title}
              items={section.items}
              className="px-2"
              currentPath={pathname}
            />
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-2 py-2">
        <SidebarMenu>
          <UserDropdown />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
