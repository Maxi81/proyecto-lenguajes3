"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  onSuccess?: () => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalButtonProps) {
  if (!amount || amount <= 0) {
    return null;
  }
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        intent: "capture",
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{
          layout: "horizontal",
          color: "blue",
          shape: "rect",
          label: "pay",
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order?.capture();
            console.log("Pago capturado exitosamente:", details);
            if (onSuccess) {
              onSuccess();
            }
          } catch (error) {
            console.error("Error al capturar el pago:", error);
          }
        }}
        onError={(err) => {
          console.error("Error en PayPal:", err);
        }}
      />
    </PayPalScriptProvider>
  );
}
