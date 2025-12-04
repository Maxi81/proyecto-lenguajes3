"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function CartButton({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const { openCart } = useCart();
  return (
    <Button variant="ghost" size="icon" onClick={openCart} aria-label="Abrir carrito" disabled={isLoggedIn === false}>
      <ShoppingCart className="w-6 h-6" />
    </Button>
  );
}
