"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
import { addToCart } from "@/app/carrito/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props { id: number; className?: string; }

export default function AddToCartBtn({ id, className }: Props) {
  const { openCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const res = await addToCart(id, 1);
      if (!(res as any)?.error) {
        openCart();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={className ?? "w-full h-12 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold"}
      disabled={isLoading}
      onClick={handleAdd}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isLoading ? "Agregando..." : "AGREGAR AL CARRITO"}
    </Button>
  );
}
