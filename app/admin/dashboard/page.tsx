import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "../actions";
import { formatPrice } from "@/lib/utils";
import AdminSearchBar from "@/components/admin-search-bar";

const ITEMS_PER_PAGE = 12;

export default async function AdminDashboard(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const page = Number(searchParams.page) || 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const supabase = await createClient();
  
  // Construir consulta con filtros y paginación
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // Aplicar búsqueda si existe
  if (q && q.trim().length > 0) {
    query = query.ilike("title", `%${q}%`);
  }

  // Aplicar paginación
  query = query.range(from, to);

  const { data: products, count } = await query;

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado con título, buscador y botón */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Panel de Administración
          </h1>
          <div className="flex-1 flex justify-center max-w-md w-full">
            <AdminSearchBar />
          </div>
          <Link href="/admin/productos/crear">
            <Button className="gap-2">
              <PlusCircle className="h-5 w-5" />
              Agregar Nuevo Producto
            </Button>
          </Link>
        </div>

        <div className="mt-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-slate-700 dark:text-slate-300">Imagen</th>
                  <th className="px-4 py-3 text-slate-700 dark:text-slate-300">Título</th>
                  <th className="px-4 py-3 text-slate-700 dark:text-slate-300">Precio</th>
                  <th className="px-4 py-3 text-slate-700 dark:text-slate-300">Stock</th>
                  <th className="px-4 py-3 text-slate-700 dark:text-slate-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(!products || products.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-600 dark:text-slate-300">
                      {q && q.trim().length > 0
                        ? `No se encontraron productos para "${q}"`
                        : "No hay productos aún."}
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b border-slate-200 dark:border-slate-800">
                      <td className="px-4 py-3">
                        <div className="relative h-16 w-12 rounded overflow-hidden bg-slate-100 dark:bg-slate-800">
                          {p.image_url ? (
                            <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{p.title}</td>
                      <td className="px-4 py-3 font-semibold text-amber-500">$ {formatPrice(p.price)}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{p.stock ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/productos/${p.id}/editar`}>
                            <Button variant="outline" className="gap-2">
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Button>
                          </Link>
                          <DeleteProductForm id={p.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {products && products.length > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            {page > 1 && (
              <Link
                href={buildPaginationUrl(page - 1, q)}
                className="px-4 py-2 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
              >
                Anterior
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === page;
              return (
                <Link
                  key={p}
                  href={buildPaginationUrl(p, q)}
                  className={
                    isCurrent
                      ? "px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                      : "px-4 py-2 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
                  }
                >
                  {p}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link
                href={buildPaginationUrl(page + 1, q)}
                className="px-4 py-2 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
              >
                Siguiente
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function buildPaginationUrl(page: number, q?: string): string {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  if (q) params.set("q", q);
  return `/admin/dashboard?${params.toString()}`;
}

function DeleteProductForm({ id }: { id: number }) {
  async function deleteProductWithId() {
    "use server";
    return deleteProduct(id);
  }

  return (
    <form action={deleteProductWithId}>
      <Button type="submit" variant="destructive" className="gap-2">
        <Trash2 className="h-4 w-4" />
        Borrar
      </Button>
    </form>
  );
}
