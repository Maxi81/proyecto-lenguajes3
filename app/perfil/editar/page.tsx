import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { updateProfile } from "../actions";
import { User } from "lucide-react";

export default async function EditarPerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, bio, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Editar Perfil</h1>

      <form action={updateProfile} className="space-y-6 bg-slate-900 rounded-xl p-6 border border-slate-800">
        {/* Sección de foto de perfil */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <div className="flex-1">
            <Input
              type="file"
              name="avatar"
              accept="image/*"
              className="max-w-xs text-xs bg-slate-800 border-slate-700"
            />
            <p className="text-xs text-slate-400 mt-2">Deja vacío para mantener la foto actual</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-200">Nombre de Usuario</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile?.username || ""}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            placeholder="Tu nombre público"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Label htmlFor="bio" className="text-left font-medium text-white">
            Sobre mí
          </Label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={profile?.bio || ""}
            placeholder="Cuéntanos algo sobre ti..."
            className="min-h-[100px] bg-slate-800 border border-slate-700 rounded-md text-white placeholder:text-slate-400 p-3"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="ghost" className="w-full">
            <Link href="/perfil">Cancelar</Link>
          </Button>
          <Button type="submit" className="w-full">Guardar Cambios</Button>
        </div>
      </form>
    </div>
  );
}
