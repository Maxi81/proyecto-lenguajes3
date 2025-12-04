"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const telefono = (formData.get("telefono") as string)?.trim() || "";
  const mensaje = (formData.get("mensaje") as string)?.trim() || "";

  if (!nombre || !email) {
    return { error: "Nombre y email son obligatorios" };
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "maxicorbalan8102@gmail.com",
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
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
      `,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error enviando correo de contacto:", err);
    return { error: err?.message || "No se pudo enviar el correo" };
  }
}
