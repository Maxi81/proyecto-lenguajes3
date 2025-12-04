import { ProductImageZoom } from "@/components/product-image-zoom";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import InteractionButtons from "@/components/interaction-buttons";
import AddToCartBtn from "@/components/add-to-cart-btn";
import BuyNowButton from "@/components/buy-now-button";

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product || error) {
    notFound();
  }

  // Obtener usuario y estados de favorito/deseado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFavoriteCount = 0;
  let isWishlistCount = 0;

  if (user) {
    const [{ count: favCount }, { count: wishCount }] = await Promise.all([
      supabase
        .from("favorites")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("product_id", product.id),
      supabase
        .from("wishlist")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("product_id", product.id),
    ]);
    isFavoriteCount = favCount || 0;
    isWishlistCount = wishCount || 0;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Grid principal de 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Columna Izquierda - Imagen con Zoom */}
        <ProductImageZoom src={product.image_url} alt={product.title} />

        {/* Columna Derecha - Información del Producto */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="hover:underline text-gray-400 hover:text-white">Inicio</Link>
            <span className="text-gray-400">/</span>
            <Link href="/productos" className="hover:underline text-gray-400 hover:text-white">Catálogo</Link>
            <span className="text-gray-400">/</span>
            <span className="text-white font-medium">{product.title}</span>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            {product.title}
          </h1>

          {/* Precio */}
          <p className="text-3xl font-bold text-amber-500">$ {formatPrice(product.price)}</p>

          {/* Estado y Demografía */}
          <div className="flex items-center gap-4 mb-6">
            {product.status ? (
              <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm uppercase">
                {product.status}
              </span>
            ) : null}
            {product.demography ? (
              <span className="border border-slate-600 text-slate-300 px-3 py-1 rounded-full text-sm uppercase">
                {product.demography}
              </span>
            ) : null}
          </div>

          {/* Descripción */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">
              Descripción
            </h2>
            <p className="whitespace-pre-line text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
            <AddToCartBtn 
              id={product.id} 
              className="w-full h-12 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold" 
            />
            <BuyNowButton
              productId={product.id}
              productTitle={product.title}
              productPrice={product.price}
              productImage={product.image_url}
            />
            {/* Botones de interacción: Favorito y Wishlist */}
            <div className="pt-2">
              <InteractionButtons
                productId={product.id}
                initialIsFavorite={isFavoriteCount > 0}
                initialIsWishlist={isWishlistCount > 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
