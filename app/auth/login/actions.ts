"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  // Crear el cliente de Supabase
  const supabase = await createClient();

  // Obtener email y password del formData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Ejecutar signInWithPassword
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Si hay error, redirigir al login con un parámetro de error
  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.user) {
    redirect("/auth/login?error=No user data returned");
  }

  // Consultar inmediatamente la tabla profiles
  let userRole: string | null = null;

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      console.error("Profile error details:", {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code,
      });
    } else {
      userRole = profile?.role || null;
    }
  } catch (profileException) {
    console.error("Exception while fetching profile:", profileException);
  }

  // Revalidar la ruta
  revalidatePath("/", "layout");

  // Redirigir según el rol
  if (userRole === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/");
  }
}
