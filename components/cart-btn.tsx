"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { useRouter } from "next/navigation";

export default function CartBtn({ isLoggedIn }: { isLoggedIn: boolean }) {
	const { openCart } = useCart();
	const router = useRouter();

	const handleClick = () => {
		if (!isLoggedIn) {
			router.push("/auth/login");
			return;
		}
		openCart();
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleClick} aria-label="Abrir carrito">
			<ShoppingCart className="w-6 h-6" />
		</Button>
	);
}
