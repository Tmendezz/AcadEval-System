import { Link } from "wouter";
import BrandLogo from "@/assets/logo-header.png";
import { SidebarHeader } from "@/shared/components/ui/sidebar";
export function SidebarBrand() {
  return (
    <SidebarHeader className="border-b border-border">
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold px-2 py-3"
      >
        <div className="h-6 w-6 text-red-500 flex-shrink-0 flex items-center justify-center">
          <img  src={BrandLogo} alt="Logo"  className="object-contain" />
        </div>
        <span className="text-3xl truncate border-b-[1px] border-red-500">S.A.P.E.E</span>
        <span className="text-xs text-muted-foreground">ITEC</span>
      </Link>
    </SidebarHeader>
  );
}
