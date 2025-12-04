import { sendContactEmail } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export default async function ContactoPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Título principal */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white">CONTACTO</h1>
        <div className="mx-auto mt-3 w-24 h-1 bg-amber-500 rounded" />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        {/* Columna Izquierda - Información */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">CONTACTANOS</h2>
          <p className="text-slate-300">
            Contáctanos utilizando el formulario, o escríbenos por email. Te responderemos lo antes posible.
          </p>
          <div className="flex items-center gap-3 text-slate-200">
            <Mail className="w-5 h-5 text-amber-500" />
            <a href="mailto:info@lalibreria.com" className="hover:underline">info@lalibreria.com</a>
          </div>
          <div className="text-slate-400">
            <p>
              <span className="font-semibold text-slate-300">Dirección:</span> Av. Siempre Viva 742, Springfield
            </p>
            <p>
              <span className="font-semibold text-slate-300">Teléfono:</span> +54 9 11 5555-5555
            </p>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow">
          <form action={sendContactEmail} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="text-slate-200">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                placeholder="Tu nombre"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                placeholder="tu@email.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefono" className="text-slate-200">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                placeholder="Opcional"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mensaje" className="text-slate-200">Mensaje</Label>
              <textarea
                id="mensaje"
                name="mensaje"
                className="min-h-[140px] bg-slate-800 border border-slate-700 rounded-md text-white placeholder:text-slate-400 p-3 resize-none !resize-none"
                style={{ resize: 'none' }}
                placeholder="Escribe tu mensaje aquí... (opcional)"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6">ENVIAR</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
