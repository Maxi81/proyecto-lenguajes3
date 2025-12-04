"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValue = params.get(key);

      // Toggle: si el valor ya está activo, quitarlo
      if (currentValue === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Resetear a página 1 cuando se cambia un filtro
      params.set("page", "1");

      router.push(`/productos?${params.toString()}`);
    },
    [router, searchParams]
  );

  const demography = searchParams.get("demography");
  const status = searchParams.get("status");
  const sortPrice = searchParams.get("sort_price");

  return (
    <aside className="w-full md:w-64 flex flex-col gap-8">
      {/* Título principal */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-white">
          FILTROS
        </h2>
        <hr className="border-t border-slate-700 mb-4" />
      </div>

      {/* Demografía */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Demografía</h3>
        <div className="flex flex-col gap-2">
          {["Shonen", "Seinen", "Comics"].map((demo) => (
            <button
              key={demo}
              onClick={() => handleFilter("demography", demo)}
              className={
                demography === demo
                  ? "px-4 py-2 rounded-full bg-slate-900 text-white font-medium text-sm"
                  : "px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-900 font-medium text-sm hover:bg-slate-100"
              }
            >
              {demo}
            </button>
          ))}
        </div>
      </div>

      {/* Estado */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Estado</h3>
        <div className="flex flex-col gap-2">
          {["Serie en Curso", "Serie Finalizada"].map((st) => (
            <button
              key={st}
              onClick={() => handleFilter("status", st)}
              className={
                status === st
                  ? "px-4 py-2 rounded-full bg-slate-900 text-white font-medium text-sm"
                  : "px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-900 font-medium text-sm hover:bg-slate-100"
              }
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ordenar por Precio */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Ordenar por Precio</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleFilter("sort_price", "asc")}
            className={
              sortPrice === "asc"
                ? "px-4 py-2 rounded-full bg-slate-900 text-white font-medium text-sm"
                : "px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-900 font-medium text-sm hover:bg-slate-100"
            }
          >
            Menor a Mayor
          </button>
          <button
            onClick={() => handleFilter("sort_price", "desc")}
            className={
              sortPrice === "desc"
                ? "px-4 py-2 rounded-full bg-slate-900 text-white font-medium text-sm"
                : "px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-900 font-medium text-sm hover:bg-slate-100"
            }
          >
            Mayor a Menor
          </button>
        </div>
      </div>
    </aside>
  );
}
