/**
 * Loader centralizado único para toda la aplicación
 * Siempre se renderiza a la misma altura con el texto "Cargando"
 */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Cargando</p>
      </div>
    </div>
  );
}
