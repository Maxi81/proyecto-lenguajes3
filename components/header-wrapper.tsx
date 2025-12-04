"use client";

import { usePathname } from "next/navigation";

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Ocultar el header en páginas de autenticación
  if (pathname.startsWith("/auth")) {
    return null;
  }

  return <>{children}</>;
}
