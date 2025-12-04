import { createProduct } from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function Page() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Nuevo Producto</h1>
        <form action={createProduct} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Título del Producto</Label>
            <Input id="title" name="title" type="text" placeholder="Ej: One Piece #1" required />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" name="price" type="text" placeholder="Ej: 15.500" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">Stock Disponible</Label>
              <Input id="stock" name="stock" type="number" min="0" placeholder="Ej: 20" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
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
            <Label htmlFor="image">Imagen del Producto</Label>
            <Input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*"
              className="file:bg-slate-800 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 cursor-pointer"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripción del producto"
              className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            />
          </div>

          <Button type="submit" className="mt-2">Guardar Producto</Button>
        </form>
      </div>
    </div>
  );
}
