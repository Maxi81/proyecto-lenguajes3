import { LogoutButton } from "@/components/logout-button";

export default function AdminHeader() {
  return (
    <header className="bg-slate-900 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Izquierda - Título */}
        <span className="text-sm font-semibold opacity-80">
          Panel de Administración
        </span>

        {/* Derecha - Logout */}
        <LogoutButton />
      </div>
    </header>
  );
}
