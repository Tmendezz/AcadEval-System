import fondo_login_MOL from "@/assets/fondo_login_MOL.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-secondary-foreground/50 to-muted flex items-center justify-center p-4 relative">
      <img
        src={fondo_login_MOL}
        alt="Fondo"
        className="fixed inset-0 w-full h-full object-cover"
      />
      <div className="fixed inset-0 bg-black/15 z-[1]" />
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}
