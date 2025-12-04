"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const value = (e.currentTarget.value || "").trim();
        if (value.length > 0) {
          router.push(`/productos?q=${encodeURIComponent(value)}`);
        }
      }
    },
    [router]
  );

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
      <Input
        type="text"
        name="q"
        defaultValue={currentQuery}
        onKeyDown={handleKeyDown}
        placeholder="Buscar productos..."
        className="pl-8"
      />
    </div>
  );
}
