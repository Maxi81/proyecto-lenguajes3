export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animado */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        
        {/* Texto de carga */}
        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 animate-pulse">
          Cargando panel...
        </p>
      </div>
    </div>
  );
}
