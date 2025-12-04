import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Heart, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileImage } from "./actions";

export default async function PerfilPage() {
  const supabase = await createClient();

  // Verificar sesión del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Obtener datos del perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, bio, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName = profile?.username || user.email || "Usuario";
  const bio = profile?.bio || "Sin descripción";
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Tarjeta de Cabecera del Perfil */}
        <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Foto de Perfil (solo visualización) */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center flex-shrink-0">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile?.username || "Sin nombre de usuario"}</h1>
              <p className="text-slate-400 text-sm mb-3">{user.email}</p>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 mt-4">Sobre mí</h3>
              <p className="whitespace-pre-line text-gray-200 leading-relaxed">{profile?.bio || "Sin descripción"}</p>
            </div>
          </div>
        </div>

        {/* Sección de Botones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Botón Mis Favoritos */}
          <Link href="/perfil/favoritos" className="w-full">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border-2 border-slate-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Mis Favoritos
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  Productos que has marcado como favoritos
                </p>
              </div>
            </div>
          </Link>

          {/* Botón Lista de Deseados */}
          <Link href="/perfil/deseados" className="w-full">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border-2 border-slate-200 dark:border-slate-700 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Lista de Deseados
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  Productos que quieres conseguir próximamente
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Botón de Editar Perfil */}
        <div className="mt-8 text-center">
          <Link href="/perfil/editar">
            <Button variant="outline" size="lg" className="gap-2">
              <User className="w-4 h-4" />
              Editar Perfil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
