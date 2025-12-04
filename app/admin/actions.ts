"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  // 1) Obtener todos los datos del formData
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const status = formData.get("status") as string | null;
  const demography = formData.get("demography") as string | null;
  const imageFile = formData.get("image") as File | null;
  const stockRaw = formData.get("stock") as string | null;

  // 2) Procesar el precio
  const rawPrice = formData.get("price") as string;
  const price = rawPrice ? Number(rawPrice.replace(/\./g, "")) : 0;
  const stock = stockRaw ? Number(stockRaw) : 0;

  // 3) Validación básica
  if (!title || !price || !description || !imageFile) {
    return { error: "Faltan campos requeridos" };
  }

  // 4) Subir imagen a Supabase Storage
  const supabase = await createClient();
  const filePath = `${Date.now()}-${imageFile.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(filePath, imageFile);

  if (uploadError) {
    return { error: `Error al subir imagen: ${uploadError.message}` };
  }

  // 5) Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  // 6) Insert en Supabase
  const { error } = await supabase
    .from("products")
    .insert({
      title,
      price,
      description,
      image_url: publicUrl,
      status,
      demography,
      stock,
    });

  if (error) {
    return { error: error.message };
  }

  // Revalidar páginas relevantes
  revalidatePath("/productos");
  revalidatePath("/admin/dashboard");

  // Redirigir al dashboard de admin
  redirect("/admin/dashboard");
}

export async function deleteProduct(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/productos");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function updateProduct(formData: FormData) {
  // 1) Obtener todos los datos del formData
  const idRaw = formData.get("id") as string | null;
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const status = formData.get("status") as string | null;
  const demography = formData.get("demography") as string | null;
  const imageFile = formData.get("image") as File | null;
  const stockRaw = formData.get("stock") as string | null;

  // 2) Procesar el precio
  const rawPrice = formData.get("price") as string;
  const price = rawPrice ? Number(rawPrice.replace(/\./g, "")) : 0;
  const stock = stockRaw ? Number(stockRaw) : undefined;

  // 3) Validaciones
  if (!idRaw) {
    return { error: "Falta el id del producto" };
  }

  const id = Number(idRaw);

  // 4) Subir nueva imagen si existe
  const supabase = await createClient();
  let newImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const filePath = `${Date.now()}-${imageFile.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, imageFile);

    if (uploadError) {
      return { error: `Error al subir imagen: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    newImageUrl = publicUrl;
  }

  // 5) Update en Supabase
  const updatePayload: Record<string, unknown> = {};
  if (title != null) updatePayload.title = title;
  if (!Number.isNaN(price) && price > 0) updatePayload.price = price;
  if (newImageUrl != null) updatePayload.image_url = newImageUrl;
  if (description != null) updatePayload.description = description;
  if (status != null) updatePayload.status = status;
  if (demography != null) updatePayload.demography = demography;
  if (typeof stock === "number" && !Number.isNaN(stock)) updatePayload.stock = stock;

  const { error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/productos");
  revalidatePath("/admin/dashboard");

  redirect("/admin/dashboard");
}
