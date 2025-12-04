"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CartItemWithProduct = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at?: string;
  products: {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    price: number;
    status: string | null;
    demography: string | null;
    stock: number | null;
    created_at?: string;
  };
};

export async function getCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo el carrito:", error);
    return [] as CartItemWithProduct[];
  }

  return (data as unknown as CartItemWithProduct[]) ?? [];
}

export async function addToCart(productId: number, quantity: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!productId || !quantity || quantity < 1) {
    return { error: "Cantidad inválida." } as const;
  }

  // Verificar stock del producto
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Producto no encontrado." } as const;
  }

  const available = typeof product.stock === "number" ? product.stock : 0;

  // Obtener item existente del carrito para sumar cantidades
  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingError && existingError.code !== "PGRST116") {
    console.error("Error buscando item existente:", existingError);
  }

  const nextQuantity = (existing?.quantity ?? 0) + quantity;
  if (nextQuantity > available) {
    return { error: "No hay stock suficiente." } as const;
  }

  // Upsert del item (suma si existe, crea si no)
  const { error: upsertError } = await supabase
    .from("cart_items")
    .upsert(
      [{ user_id: user.id, product_id: productId, quantity: nextQuantity }],
      { onConflict: "user_id,product_id" }
    );

  if (upsertError) {
    console.error("Error al agregar al carrito:", upsertError);
    return { error: "No se pudo agregar al carrito." } as const;
  }

  revalidatePath("/");
  return { success: true } as const;
}

export async function removeFromCart(itemId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("id", itemId);

  if (error) {
    console.error("Error al eliminar del carrito:", error);
    return { error: "No se pudo eliminar del carrito." } as const;
  }

  revalidatePath("/");
  return { success: true } as const;
}

export async function updateQuantity(itemId: number, quantity: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!itemId || !quantity || quantity < 1) {
    return { error: "Cantidad inválida." } as const;
  }

  // Obtener el item para conocer el product_id
  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("id, product_id")
    .eq("user_id", user.id)
    .eq("id", itemId)
    .single();

  if (itemError || !item) {
    return { error: "Item no encontrado." } as const;
  }

  // Verificar stock del producto
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock")
    .eq("id", item.product_id)
    .single();

  if (productError || !product) {
    return { error: "Producto no encontrado." } as const;
  }

  const available = typeof product.stock === "number" ? product.stock : 0;
  if (quantity > available) {
    return { error: "No hay stock suficiente." } as const;
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", user.id)
    .eq("id", itemId);

  if (error) {
    console.error("Error al actualizar cantidad del carrito:", error);
    return { error: "No se pudo actualizar la cantidad." } as const;
  }

  revalidatePath("/");
  return { success: true } as const;
}

export async function clearCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error al limpiar el carrito:", error);
    return { error: "No se pudo limpiar el carrito." } as const;
  }

  revalidatePath("/");
  return { success: true } as const;
}

export async function checkoutCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Obtener todos los items del carrito del usuario
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("user_id", user.id);

  if (cartError || !cartItems) {
    console.error("Error obteniendo items del carrito:", cartError);
    return { error: "No se pudo procesar el carrito." } as const;
  }

  if (cartItems.length === 0) {
    return { error: "El carrito está vacío." } as const;
  }

  // Procesar cada item: usar RPC decrement_stock para restar stock de forma segura
  for (const item of cartItems) {
    const { data: success, error: rpcError } = await supabase.rpc(
      "decrement_stock",
      {
        row_id: item.product_id,
        quantity_to_subtract: item.quantity,
      }
    );

    if (rpcError || success === false) {
      console.error(
        `Error al decrementar stock para producto ${item.product_id}:`,
        rpcError
      );
      return {
        error: `Stock insuficiente para producto ${item.product_id}.`,
      } as const;
    }
  }

  // Eliminar todos los items del carrito después de procesar exitosamente
  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Error al limpiar el carrito:", deleteError);
    return { error: "No se pudo limpiar el carrito." } as const;
  }

  // Revalidar las rutas relacionadas
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/dashboard");

  return { success: true } as const;
}

export async function checkoutSingleProduct(
  productId: number,
  quantity: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!productId || !quantity || quantity < 1) {
    return { error: "Datos inválidos." } as const;
  }

  // Usar RPC decrement_stock para restar stock de forma segura y atómica
  const { data: success, error: rpcError } = await supabase.rpc(
    "decrement_stock",
    {
      row_id: productId,
      quantity_to_subtract: quantity,
    }
  );

  if (rpcError || success === false) {
    console.error(`Error al decrementar stock para producto ${productId}:`, rpcError);
    return {
      error: `Stock insuficiente o producto no encontrado.`,
    } as const;
  }

  // Revalidar las rutas relacionadas
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/dashboard");

  return { success: true } as const;
}
