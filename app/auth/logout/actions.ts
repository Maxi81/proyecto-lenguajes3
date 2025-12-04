"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOutAction() {
  // Crear el cliente de Supabase para servidor
  const supabase = await createClient();

  // Cerrar sesión
  await supabase.auth.signOut();

  // Revalidar toda la app, incluido el header
  revalidatePath("/", "layout");

  // Redirigir al inicio
  redirect("/");
}
