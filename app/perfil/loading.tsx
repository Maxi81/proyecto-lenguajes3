export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-foreground rounded-full animate-spin"></div>
        </div>
        
        {/* Texto de carga */}
        <p className="text-lg font-semibold text-muted-foreground animate-pulse">
          Cargando perfil...
        </p>
      </div>
    </div>
  );
}
