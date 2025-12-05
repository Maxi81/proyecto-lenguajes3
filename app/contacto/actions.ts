"use server";

import nodemailer from "nodemailer";

export async function sendContactEmail(formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const telefono = (formData.get("telefono") as string)?.trim() || "";
  const mensaje = (formData.get("mensaje") as string)?.trim() || "";

  if (!nombre || !email) {
    return { error: "Nombre y email son obligatorios" };
  }

  console.log("📧 [sendContactEmail] Procesando formulario de contacto...");
  console.log("👤 Nombre:", nombre);
  console.log("📧 Email:", email);

  // Crear transporter de Nodemailer con Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color:#0f172a;">
      <h2 style="margin:0 0 12px;">Nuevo mensaje de contacto</h2>
      <p style="margin:0 0 16px;">Has recibido un nuevo mensaje desde el formulario de contacto.</p>
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:16px 0;" />
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ""}
      <p style="margin-top:12px"><strong>Mensaje:</strong></p>
      <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; white-space:pre-wrap;">${mensaje}</div>
    </div>
  `;

  try {
    console.log("📤 Enviando email de contacto con Nodemailer...");

    const mailOptions = {
      from: `"Formulario Web" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // El correo te llega a ti mismo
      replyTo: email, // Para que puedas responder directamente al cliente
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email de contacto enviado exitosamente!");
    console.log("📬 Message ID:", info.messageId);

    return { success: true };
  } catch (err: any) {
    console.error("💥 Error enviando correo de contacto:", err);
    console.error("Error message:", err?.message);
    console.error("Error code:", err?.code);
    return { error: err?.message || "No se pudo enviar el correo" };
  }
}
