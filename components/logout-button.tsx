"use client";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/auth/logout/actions";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost">
        Cerrar Sesión
      </Button>
    </form>
  );
}
