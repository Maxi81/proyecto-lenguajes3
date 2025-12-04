import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "@/components/add-to-cart-btn";

interface ProductCardProps {
  id: number | string;
  image: string;
  title: string;
  price: string;
}

export function ProductCard({ id, image, title, price }: ProductCardProps) {
  return (
    <div className="border bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/productos/${id}`}>
        {/* Imagen */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg cursor-pointer">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-bold uppercase text-sm mb-2 text-gray-800 line-clamp-2 hover:text-amber-600 transition-colors">
            {title}
          </h3>
          <p className="text-xl font-bold text-gray-700 mb-4 text-center">
            {price}
          </p>
        </div>
      </Link>
      
      {/* Botón fuera del Link */}
      <div className="px-4 pb-4">
        <AddToCartBtn id={Number(id)} className="w-full bg-amber-500 hover:bg-amber-600 text-white" />
      </div>
    </div>
  );
}
