import { ProductCard } from "@/components/product-card";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import ProductFilters from "@/components/product-filters";
import { Suspense } from "react";

export default async function ProductosPage(props: {
  searchParams: Promise<{ q?: string; page?: string; demography?: string; status?: string; sort_price?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { q, page: pageParam, demography, status, sort_price } = searchParams;
  const page = Math.max(parseInt(pageParam || "1", 10) || 1, 1);
  const ITEMS_PER_PAGE = 12;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .gt("stock", 0)
    .range(from, to);

  // Filtro de búsqueda por título
  if (q && q.trim().length > 0) {
    query = query.ilike("title", `%${q}%`);
  }

  // Filtro por demografía
  if (demography) {
    query = query.eq("demography", demography);
  }

  // Filtro por estado
  if (status) {
    query = query.eq("status", status);
  }

  // Ordenamiento
  if (sort_price === "asc") {
    query = query.order("price", { ascending: true });
  } else if (sort_price === "desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products, count } = await query;
  const totalPages = Math.ceil(((count as number) || 0) / ITEMS_PER_PAGE) || 1;

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Título principal */}
      <h1 className="text-3xl font-bold text-center mb-8 uppercase">
        {q && q.trim().length > 0 ? `Resultados para: "${q}"` : "CATÁLOGO DE PRODUCTOS"}
      </h1>

      {/* Layout de dos columnas */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar izquierdo con filtros */}
        <Suspense fallback={<div className="w-full md:w-64 h-96 bg-slate-800 animate-pulse rounded-lg" />}>
          <ProductFilters />
        </Suspense>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Grid de productos */}
          {(!products || products.length === 0) ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-600 text-center">
                No hay productos disponibles por el momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
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

          {/* Paginación */}
          <div className="flex justify-center mt-12 gap-2">
            {page > 1 && (
              <Link
                href={buildPaginationUrl(page - 1, q, demography, status, sort_price)}
                className="px-4 py-2 rounded bg-white text-slate-900 font-semibold hover:bg-slate-100 border"
              >
                Anterior
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === page;
              return (
                <Link
                  key={p}
                  href={buildPaginationUrl(p, q, demography, status, sort_price)}
                  className={
                    isCurrent
                      ? "px-4 py-2 rounded bg-slate-900 text-white font-semibold"
                      : "px-4 py-2 rounded bg-white text-slate-900 font-semibold hover:bg-slate-100 border"
                  }
                >
                  {p}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link
                href={buildPaginationUrl(page + 1, q, demography, status, sort_price)}
                className="px-4 py-2 rounded bg-white text-slate-900 font-semibold hover:bg-slate-100 border"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildPaginationUrl(
  page: number,
  q?: string,
  demography?: string,
  status?: string,
  sort_price?: string
): string {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  if (q) params.set("q", q);
  if (demography) params.set("demography", demography);
  if (status) params.set("status", status);
  if (sort_price) params.set("sort_price", sort_price);
  return `/productos?${params.toString()}`;
}
