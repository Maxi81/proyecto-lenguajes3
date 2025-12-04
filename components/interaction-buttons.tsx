"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { toggleFavorite, toggleWishlist } from "@/app/productos/actions";

type Props = {
  productId: number;
  initialIsFavorite: boolean;
  initialIsWishlist: boolean;
};

export default function InteractionButtons({
  productId,
  initialIsFavorite,
  initialIsWishlist,
}: Props) {
  const [isFavorite, setIsFavorite] = useState<boolean>(initialIsFavorite);
  const [isWishlist, setIsWishlist] = useState<boolean>(initialIsWishlist);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);

  const onToggleFavorite = async () => {
    if (loadingFav) return;
    setLoadingFav(true);
    // Optimistic UI
    setIsFavorite((prev) => !prev);
    try {
      await toggleFavorite(productId);
    } finally {
      setLoadingFav(false);
    }
  };

  const onToggleWishlist = async () => {
    if (loadingWish) return;
    setLoadingWish(true);
    // Optimistic UI
    setIsWishlist((prev) => !prev);
    try {
      await toggleWishlist(productId);
    } finally {
      setLoadingWish(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Favorito */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onToggleFavorite}
        disabled={loadingFav}
        className={
          isFavorite
            ? "transition-all active:scale-90 text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30"
            : "transition-all active:scale-90 text-slate-600"
        }
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart
          className="h-5 w-5"
          {...(isFavorite ? { fill: "currentColor" } : {})}
        />
      </Button>

      {/* Wishlist */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onToggleWishlist}
        disabled={loadingWish}
        className={
          isWishlist
            ? "transition-all active:scale-90 text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/30"
            : "transition-all active:scale-90 text-slate-600"
        }
        aria-label={isWishlist ? "Quitar de deseados" : "Agregar a deseados"}
        title={isWishlist ? "Quitar de deseados" : "Agregar a deseados"}
      >
        <Star
          className="h-5 w-5"
          {...(isWishlist ? { fill: "currentColor" } : {})}
        />
      </Button>
    </div>
  );
}
