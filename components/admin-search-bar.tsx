"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function AdminSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");

  // Sincronizar con el parámetro q de la URL
  useEffect(() => {
    const q = searchParams.get("q");
    setValue(q || "");
  }, [searchParams]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedValue = value.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (trimmedValue) {
        params.set("q", trimmedValue);
      } else {
        params.delete("q");
      }

      // Construir la URL con o sin parámetros
      const queryString = params.toString();
      router.push(queryString ? `/admin/dashboard?${queryString}` : "/admin/dashboard");
    }
  };

  return (
    <Input
      type="text"
      placeholder="Buscar por título..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full max-w-sm bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500"
    />
  );
}
