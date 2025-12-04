"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  // Verificar si ya existe favorito
  const { data: existing, error: fetchError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .limit(1);

  if (fetchError) {
    return { error: "Error consultando favoritos" };
  }

  if (existing && existing.length > 0) {
    const favId = existing[0].id as number;
    const { error: delError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favId);

    if (delError) {
      return { error: "Error al eliminar favorito" };
    }
  } else {
    const { error: insertError } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, product_id: productId });

    if (insertError) {
      return { error: "Error al agregar favorito" };
    }
  }

  revalidatePath("/productos/[id]");
  return { success: true };
}

export async function toggleWishlist(productId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  // Verificar si ya existe en lista de deseados
  const { data: existing, error: fetchError } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .limit(1);

  if (fetchError) {
    return { error: "Error consultando lista de deseados" };
  }

  if (existing && existing.length > 0) {
    const wishId = existing[0].id as number;
    const { error: delError } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishId);

    if (delError) {
      return { error: "Error al eliminar de deseados" };
    }
  } else {
    const { error: insertError } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, product_id: productId });

    if (insertError) {
      return { error: "Error al agregar a deseados" };
    }
  }

  revalidatePath("/productos/[id]");
  return { success: true };
}
