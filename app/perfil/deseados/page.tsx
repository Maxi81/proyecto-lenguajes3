import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default async function DeseadosPage() {
  const supabase = await createClient();

  // Obtener usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Consultar lista de deseados con join de productos
  const { data: wishlist } = await supabase
    .from("wishlist")
    .select("products(*)")
    .eq("user_id", user.id);

  const items = wishlist || [];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Mi Lista de Deseados</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <p className="text-slate-300">Tu lista de deseados está vacía.</p>
          <Link href="/productos">
            <Button>Ir al Catálogo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const p = item.products;
            if (!p) return null;
            return (
              <ProductCard
                key={p.id}
                id={p.id}
                image={p.image_url}
                title={p.title}
                price={`$ ${formatPrice(p.price)}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
