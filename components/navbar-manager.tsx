import { createClient } from "@/lib/supabase/server";
import StoreHeader from "@/components/store-header";
import AdminHeader from "@/components/admin-header";

export default async function NavbarManager() {
  const supabase = await createClient();

  // Obtener el usuario actual
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay usuario, mostrar el header de la tienda
  if (!user) {
    return <StoreHeader />;
  }

  // Consultar el rol del usuario en la tabla profiles
  let userRole: string | null = null;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    userRole = profile?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
  }

  // Si es admin, mostrar AdminHeader
  if (userRole === "admin") {
    return <AdminHeader />;
  }

  // En cualquier otro caso, mostrar StoreHeader
  return <StoreHeader />;
}
