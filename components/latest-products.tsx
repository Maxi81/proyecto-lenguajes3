import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/utils";

export default async function LatestProducts() {
  const supabase = await createClient();
  const { data: latestProducts } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 uppercase text-white">Recién Llegados</h2>
      {(!latestProducts || latestProducts.length === 0) ? (
        <p className="text-white">No hay productos disponibles por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image_url}
              title={product.title}
              price={`$ ${formatPrice(product.price)}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
