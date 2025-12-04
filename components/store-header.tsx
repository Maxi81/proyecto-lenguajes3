import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Suspense } from "react";
import SearchBar from "@/components/search-bar";
import CartBtn from "@/components/cart-btn";
import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";

export default async function StoreHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  return (
    <header className="w-full flex gap-4 items-center justify-between p-4 border-b bg-background">
      {/* Izquierda: Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-2xl font-bold">La librería</span>
        </Link>
      </div>

      {/* Centro: Navegación y Búsqueda */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl justify-center">
        <Link href="/productos" className="hover:underline font-medium">
          Productos
        </Link>
        <Link href="/contacto" className="hover:underline font-medium">
          Contacto
        </Link>
        <div className="flex-1 max-w-md mx-auto"><SearchBar /></div>
      </div>

      {/* Derecha: Carrito y Auth */}
      <div className="flex items-center gap-2">
        <CartBtn isLoggedIn={isLoggedIn} />
        <Suspense fallback={<div className="p-2">Cargando...</div>}>
          <AuthButton />
        </Suspense>
      </div>
    </header>
  );
}
