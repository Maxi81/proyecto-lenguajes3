"use server";

import nodemailer from "nodemailer";
import { formatPrice } from "@/lib/utils";

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
};

export async function sendOrderConfirmation(email: string, items: OrderItem[]) {
  console.log("🔔 [sendOrderConfirmation] Iniciando envío de email...");
  console.log("📧 Email destino:", email);
  console.log("📦 Items a enviar:", JSON.stringify(items, null, 2));
  console.log("🔑 GMAIL_USER configurado:", !!process.env.GMAIL_USER);
  console.log("🔑 GMAIL_PASS configurado:", !!process.env.GMAIL_PASS);

  // Crear transporter de Nodemailer con Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log("💰 Total calculado:", total);

  const itemsHtml = items
    .map(
      (item) =>
        `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px; text-align: left;">${item.title}</td>
      <td style="padding: 12px; text-align: center;">$ ${formatPrice(item.price)}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">$ ${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="margin: 0 0 24px; color: #1e293b;">¡Gracias por tu compra!</h2>
        
        <p style="margin: 0 0 16px; font-size: 14px;">
          Hemos recibido tu compra exitosamente. Aquí están los detalles de tu pedido:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid #e2e8f0;">
          <thead style="background-color: #f1f5f9;">
            <tr>
              <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #cbd5e1;">Producto</th>
              <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #cbd5e1;">Precio Unitario</th>
              <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #cbd5e1;">Cantidad</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; border-bottom: 2px solid #cbd5e1;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #1e293b;">
            <span>Total:</span>
            <span>$ ${formatPrice(total)}</span>
          </div>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #64748b;">
          Si tienes preguntas sobre tu compra, no dudes en contactarnos.
        </p>

        <p style="margin: 16px 0 0; font-size: 12px; color: #94a3b8;">
          © 2024 La Librería. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;

  try {
    console.log("📤 Intentando enviar email con Nodemailer (Gmail)...");

    const mailOptions = {
      from: `"La Librería" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Confirmación de Compra - La Librería",
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email enviado exitosamente!");
    console.log("📬 Message ID:", info.messageId);
    console.log("📊 Response:", info.response);

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("💥 Excepción capturada en sendOrderConfirmation:");
    console.error("Error completo:", err);
    console.error("Error message:", err?.message);
    console.error("Error code:", err?.code);
    return { error: err?.message || "Error enviando correo" };
  }
}
