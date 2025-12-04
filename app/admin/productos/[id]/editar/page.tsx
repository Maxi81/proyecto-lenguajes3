import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { updateProduct } from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product || error) {
    notFound();
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Editar Producto</h1>
        <form action={updateProduct} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={product.id} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Título del Producto</Label>
            <Input id="title" name="title" type="text" defaultValue={product.title} required />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" name="price" type="text" defaultValue={formatPrice(product.price)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">Stock Disponible</Label>
              <Input id="stock" name="stock" type="number" min="0" defaultValue={product.stock ?? 0} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
                defaultValue={product.status ?? ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="Serie Finalizada">Serie Finalizada</option>
                <option value="Serie en Curso">Serie en Curso</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="demography">Demografía</Label>
              <select
                id="demography"
                name="demography"
                defaultValue={product.demography ?? ""}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="Seinen">Seinen</option>
                <option value="Shonen">Shonen</option>
                <option value="Comics">Comics</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Imagen Actual</Label>
            <div className="border rounded-md p-3 bg-slate-50 dark:bg-slate-900">
              <img 
                src={product.image_url} 
                alt={product.title}
                className="w-32 h-auto rounded-md object-cover"
              />
            </div>
            <Label htmlFor="image" className="mt-2">Cambiar Imagen (opcional)</Label>
            <Input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*"
              className="file:bg-slate-800 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 cursor-pointer"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Deja vacío para mantener la imagen actual</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description ?? ""}
              className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>

          <Button type="submit" className="mt-2">Actualizar Producto</Button>
        </form>
      </div>
    </div>
  );
}
