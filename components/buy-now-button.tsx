"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PaypalButton from "@/components/paypal-button";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { checkoutSingleProduct } from "@/app/carrito/actions";

interface BuyNowButtonProps {
  productId: number;
  productTitle: string;
  productPrice: number;
  productImage?: string | null;
}

export default function BuyNowButton({
  productId,
  productTitle,
  productPrice,
  productImage,
}: BuyNowButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handlePaymentSuccess = async (details?: any) => {
    try {
      // Verificar opcionalmente que el pago fue completado
      if (details?.status && details.status !== "COMPLETED") {
        alert("El pago no fue completado. Por favor, intenta nuevamente.");
        return;
      }

      // Ejecutar la acción del servidor para decrementar stock
      const result = await checkoutSingleProduct(productId, 1);

      // Verificar si hay error en la respuesta
      if ((result as any)?.error) {
        alert(`Error: ${(result as any).error}`);
        return;
      }

      // Cerrar el modal
      setShowModal(false);

      // Mostrar mensaje de éxito
      alert("¡Gracias por tu compra!");

      // Redirigir a home
      router.push("/");
    } catch (err) {
      console.error("Error al procesar la compra:", err);
      alert("Hubo un problema al procesar el stock.");
    }
  };

  return (
    <>
      <Button
        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base rounded-xl"
        onClick={() => setShowModal(true)}
      >
        COMPRAR AHORA
      </Button>

      {/* Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 transition-opacity"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-900 p-6 shadow-xl border border-slate-800">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-semibold text-white">
                Confirmar Compra
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar"
              >
                ✕
              </Button>
            </div>

            {/* Product Summary */}
            <div className="mb-6 space-y-4">
              {productImage && (
                <img
                  src={productImage}
                  alt={productTitle}
                  className="h-80 w-full max-w-xs mx-auto rounded-md object-contain bg-slate-800"
                />
              )}
              <div>
                <h3 className="text-lg font-medium text-white">
                  {productTitle}
                </h3>
                <p className="mt-2 text-2xl font-bold text-amber-500">
                  $ {formatPrice(productPrice)}
                </p>
              </div>
            </div>

            {/* PayPal Button */}
            <div className="space-y-3">
              <PaypalButton
                amount={productPrice}
                onSuccess={handlePaymentSuccess}
              />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
