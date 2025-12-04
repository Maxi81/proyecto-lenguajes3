"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageZoomProps {
  src: string;
  alt: string;
}

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-white border cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-contain transition-transform duration-100 ease-out"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: showZoom ? "scale(2)" : "scale(1)",
        }}
      />
    </div>
  );
}
