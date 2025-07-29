import { ReactNode, useEffect } from "react";
import { usePathname } from "wouter/use-browser-location";
import { AppSidebar } from "./sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { Breadcrumb } from "@/shared/components/ui/breadcrumb";
import { ThemeToggle } from "./theme-toggle/theme-toggle";
import { useRouteStore } from "../stores/route-store";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { setCurrentPath } = useRouteStore();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname, setCurrentPath]);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-[4.30rem] shrink-0 items-center gap-2 px-2 border-b-[1.7px] ease-linear">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            Evaluaciones y Encuestas Académicas
          </div>
          <div className="flex items-center gap-2 mr-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 overflow-auto">
          <div className="w-full">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
