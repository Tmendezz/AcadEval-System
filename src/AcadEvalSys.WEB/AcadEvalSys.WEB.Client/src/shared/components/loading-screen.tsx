import { ReactNode } from "react";

interface LoadingScreenProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Componente reutilizable para pantallas de loading
 * Permite personalizar el mensaje, tamaño y estilos
 */
export function LoadingScreen({ 
  title = "Cargando...",
  description,
  size = "md",
  className = ""
}: LoadingScreenProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={`flex items-center justify-center h-screen bg-background ${className}`}>
      <div className="text-center space-y-4">
        <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto ${sizeClasses[size]}`}></div>
        <div className="space-y-2">
          <p className="text-lg font-medium">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Variantes predefinidas para casos comunes
export function SessionLoadingScreen() {
  return (
    <LoadingScreen 
      title="Cargando sesión..."
      description="Verificando tu autenticación"
      size="lg"
    />
  );
}

export function PageLoadingScreen() {
  return (
    <LoadingScreen 
      title="Cargando página..."
      size="md"
    />
  );
} 