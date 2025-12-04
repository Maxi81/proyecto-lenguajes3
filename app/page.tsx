import Link from "next/link";
import { Button } from "@/components/ui/button";
import LatestProducts from "@/components/latest-products";
import { Suspense } from "react";

export default async function Home() {

  return (
    <main>
      {/* Hero */}
      <section className="bg-transparent text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-extrabold tracking-tight">Bienvenido a La Librería</h1>
          <p className="mt-4 text-lg text-slate-300">Tu tienda de Cómics y Mangas favorita</p>
          <div className="mt-8">
            <Link href="/productos">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                Ver Catálogo Completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="text-center p-10 text-white">Cargando novedades...</div>}>
        <LatestProducts />
      </Suspense>
    </main>
  );
}
