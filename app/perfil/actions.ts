"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const username = (formData.get("username") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const avatarFile = formData.get("avatar") as File | null;

  const updates: Record<string, any> = {
    username,
    bio,
    updated_at: new Date().toISOString(),
  };

  // Procesar imagen si se subió una nueva
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `avatar-${user!.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);
      updates.avatar_url = publicUrl;
    }
  }

  console.log("Intentando actualizar perfil para usuario:", user.id);
  console.log("Datos a enviar:", updates);
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);
  if (error) {
    console.error("Error al actualizar perfil en Supabase:", error);
    throw new Error("No se pudo actualizar el perfil: " + error.message);
  } else {
    console.log("Perfil actualizado con éxito en la base de datos.");
  }

  revalidatePath("/perfil");
  redirect("/perfil");
}
