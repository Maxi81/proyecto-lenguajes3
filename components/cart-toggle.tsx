"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import CartDrawer from "@/components/cart-drawer";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

export default function CartToggle() {
  const [openCart, setOpenCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load initial count as sum of quantities for consistency
  useEffect(() => {
    async function loadCount() {
      try {
        const supabase = createSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase
          .from("cart_items")
          .select("quantity")
          .eq("user_id", user.id);
        if (error) return;
        const sum = (data ?? []).reduce((acc: number, row: any) => acc + (row.quantity || 0), 0);
        setCartCount(sum);
      } catch (e) {
        // ignore
      }
    }
    loadCount();
  }, []);

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenCart(true)}
          aria-label="Abrir carrito"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">
            {cartCount}
          </span>
        )}
      </div>

      <CartDrawer
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
        onItemsChange={(count) => setCartCount(count)}
        onCheckout={() => {
          setOpenCart(false);
        }}
      />
    </>
  );
}
