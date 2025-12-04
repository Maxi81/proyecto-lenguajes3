"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { addToCart } from "@/app/carrito/actions";
import { useCart } from "@/components/cart-context";

export default function AddToCartButton({ productId }: { productId: number }) {
  const { openCart } = useCart();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      className="w-full h-12 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-base rounded-xl"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await addToCart(productId, 1);
          openCart();
        })
      }
    >
      AGREGAR AL CARRITO
    </Button>
  );
}
