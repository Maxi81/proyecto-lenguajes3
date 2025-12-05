"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-context";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
  checkoutCart,
} from "@/app/carrito/actions";
import PaypalButton from "@/components/paypal-button";

export type CartItemWithProduct = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at?: string;
  products: {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    price: number;
    status: string | null;
    demography: string | null;
    stock: number | null;
    created_at?: string;
  };
};

type CartDrawerProps = {
  onCheckout?: () => void;
  onItemsChange?: (count: number) => void;
};

export default function CartDrawer({ onCheckout, onItemsChange }: CartDrawerProps) {
  const { isOpen, closeCart } = useCart();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPayPal, setShowPayPal] = useState(false);

  // Fetch cart when opening, unless we already have initial items
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        const next = await getCart();
        setItems(next);
        onItemsChange?.(next.reduce((acc, it) => acc + it.quantity, 0));
      } catch (err: any) {
        console.error("Error fetching cart:", err);
        setError("No se pudo cargar el carrito.");
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, onItemsChange]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.products?.price || 0) * item.quantity, 0);
  }, [items]);

  const handlePaymentSuccess = async (details?: any) => {
    try {
      if (details?.status && details.status !== "COMPLETED") {
        alert("El pago no fue completado. Por favor, intenta nuevamente.");
        return;
      }

      const result = await checkoutCart();

      if ((result as any)?.error) {
        alert(`Error: ${(result as any).error}`);
        return;
      }

      closeCart();
      onCheckout?.();
      alert("¡Compra exitosa! El stock se ha actualizado.");
    } catch (err) {
      console.error("Error al procesar la compra:", err);
      alert("Hubo un problema al procesar el stock.");
    }
  };

  const refresh = async () => {
    try {
      const next = await getCart();
      setItems(next);
      onItemsChange?.(next.reduce((acc, it) => acc + it.quantity, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncrement = (item: CartItemWithProduct) => {
    startTransition(async () => {
      setError(null);
      const res = await addToCart(item.product_id, 1);
      if ((res as any)?.error) {
        setError((res as any).error);
      } else {
        await refresh();
      }
    });
  };

  const handleDecrement = (item: CartItemWithProduct) => {
    startTransition(async () => {
      setError(null);
      if (item.quantity <= 1) {
        const res = await removeFromCart(item.id);
        if ((res as any)?.error) {
          setError((res as any).error);
        } else {
          await refresh();
        }
        return;
      }
      const res = await updateQuantity(item.id, item.quantity - 1);
      if ((res as any)?.error) {
        setError((res as any).error);
      } else {
        await refresh();
      }
    });
  };

  const handleUpdateQuantity = (item: CartItemWithProduct, quantity: number) => {
    startTransition(async () => {
      setError(null);
      const res = await updateQuantity(item.id, quantity);
      if ((res as any)?.error) {
        setError((res as any).error);
      } else {
        await refresh();
      }
    });
  };

  const handleRemove = (item: CartItemWithProduct) => {
    startTransition(async () => {
      setError(null);
      const res = await removeFromCart(item.id);
      if ((res as any)?.error) {
        setError((res as any).error);
      } else {
        await refresh();
      }
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-96 bg-slate-900 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h2 className="text-lg font-semibold text-white">Mi Carrito</h2>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Cerrar">
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className={`flex-1 p-4 space-y-3 ${items.length > 0 ? "overflow-auto" : "overflow-hidden"}`}>
          {error && (
            <div className="rounded-md bg-red-500/10 text-red-200 border border-red-500/30 px-3 py-2 text-sm">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-slate-300">Cargando carrito…</div>
          ) : items.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-slate-300">Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                isPending={isPending}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onRemove={handleRemove}
                onUpdate={handleUpdateQuantity}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 ? (
          <div className="border-t border-slate-800 p-4">
            <div className="mb-3 flex items-center justify-between text-white">
              <span className="text-sm text-slate-300">Subtotal</span>
              <span className="text-lg font-semibold">$ {formatPrice(subtotal)}</span>
            </div>
            {!showPayPal ? (
              <Button
                className="w-full"
                onClick={() => setShowPayPal(true)}
                disabled={isPending}
              >
                Iniciar Compra
              </Button>
            ) : (
              <div className="space-y-2">
                <PaypalButton amount={subtotal} onSuccess={handlePaymentSuccess} />
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowPayPal(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </aside>
    </>
  );
}

type CartItemRowProps = {
  item: CartItemWithProduct;
  isPending: boolean;
  onIncrement: (item: CartItemWithProduct) => void;
  onDecrement: (item: CartItemWithProduct) => void;
  onRemove: (item: CartItemWithProduct) => void;
  onUpdate: (item: CartItemWithProduct, quantity: number) => void;
};

function CartItemRow({ item, isPending, onIncrement, onDecrement, onRemove, onUpdate }: CartItemRowProps) {
  const [localQuantity, setLocalQuantity] = useState<number | "">(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const sanitizeAndUpdate = () => {
    const stock = item.products?.stock;

    if (localQuantity === "" || Number(localQuantity) <= 0 || !Number.isFinite(Number(localQuantity))) {
      setLocalQuantity(1);
      onUpdate(item, 1);
      return;
    }

    let next = Number(localQuantity);
    if (typeof stock === "number" && next > stock) {
      next = stock;
    }

    setLocalQuantity(next);

    if (next === item.quantity) return;

    onUpdate(item, next);
  };

  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-800 p-3">
      <img
        src={item.products?.image_url ?? ""}
        alt={item.products?.title ?? "Producto"}
        className="h-16 w-16 rounded object-cover bg-slate-800"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-white text-sm font-medium">
          {item.products?.title}
        </div>
        <div className="text-slate-300 text-sm">
          $ {formatPrice(item.products?.price || 0)}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onDecrement(item)}
            disabled={isPending}
            aria-label="Disminuir"
          >
            −
          </Button>
          <Input
            type="number"
            min={1}
            max={item.products?.stock ?? undefined}
            value={localQuantity}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setLocalQuantity("");
                return;
              }
              if (!/^\d+$/.test(raw)) return;
              setLocalQuantity(Number(raw));
            }}
            onBlur={sanitizeAndUpdate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sanitizeAndUpdate();
              }
            }}
            className="w-14 h-8 text-center text-white text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none m-0"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onIncrement(item)}
            disabled={isPending}
            aria-label="Aumentar"
          >
            +
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item)}
            disabled={isPending}
          >
            Borrar
          </Button>
        </div>
      </div>
    </div>
  );
}


