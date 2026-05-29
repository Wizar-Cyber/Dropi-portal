import { useState } from "react";
import { useForm } from "react-hook-form";
import { Search, Download, Plus, Filter, MoreHorizontal, Pencil, Trash2, Camera, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useAppStore, can, exportToCSV } from "../store";
import { toast } from "sonner";

interface ProductoForm {
  sku: string;
  name: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
}

export default function Inventario() {
  const { productos, authUser, addProducto, updateProducto, deleteProducto, toggleProductoStatus } = useAppStore();
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductoForm>();

  const canEdit = authUser ? can(authUser.role, "editar") : false;
  const canDelete = authUser ? can(authUser.role, "eliminar") : false;

  const filteredItems = productos.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    reset({ sku: "", name: "", category: "Electrónica", stock: 0, cost: 0, price: 0 });
    setIsModalOpen(true);
  };

  const openEdit = (id: string) => {
    const p = productos.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setValue("sku", p.sku);
    setValue("name", p.name);
    setValue("category", p.category);
    setValue("stock", p.stock);
    setValue("cost", p.cost);
    setValue("price", p.price);
    setIsModalOpen(true);
  };

  const onSubmit = (data: ProductoForm) => {
    if (editingId) {
      updateProducto(editingId, data);
      toast.success("Producto actualizado");
    } else {
      addProducto({ ...data, active: true });
      toast.success("Producto añadido correctamente");
    }
    setIsModalOpen(false);
    reset();
  };

  const getStockBadgeDesc = (stock: number) => {
    if (stock < 10) return { label: "Stock Crítico", className: "bg-red-100 text-red-700" };
    if (stock < 20) return { label: "Stock Bajo", className: "bg-yellow-100 text-yellow-700" };
    return { label: "Disponible", className: "bg-green-100 text-green-700" };
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportToCSV(productos as any, "inventario");
      setIsExporting(false);
      toast.success("Inventario exportado");
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col mt-[-100px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">{editingId ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>
              <button onClick={() => { setIsModalOpen(false); reset(); }} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">SKU <span className="text-red-500">*</span></label>
                     <input type="text" {...register("sku", { required: true })} placeholder="Ej: PRD-001" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono" />
                   </div>
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Categoría</label>
                     <select {...register("category")} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                       <option>Electrónica</option>
                       <option>Accesorios</option>
                       <option>Computación</option>
                       <option>Hogar</option>
                       <option>Moda</option>
                     </select>
                   </div>
                 </div>
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Nombre del Producto <span className="text-red-500">*</span></label>
                   <input type="text" {...register("name", { required: true })} placeholder="Ej: Audífonos Wireless" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Stock</label>
                     <input type="number" {...register("stock", { min: 0 })} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Costo</label>
                     <input type="number" step="0.01" {...register("cost", { min: 0 })} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Precio</label>
                     <input type="number" step="0.01" {...register("price", { min: 0 })} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                 </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button type="button" onClick={() => { setIsModalOpen(false); reset(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                   Cancelar
                 </button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                   {editingId ? "Actualizar" : "Guardar Producto"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 m-0">Inventario</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold border border-gray-200">
            {productos.length} totales
          </span>
        </div>
        <div className="flex items-center gap-3">
           <button
             onClick={handleExportCSV}
             disabled={isExporting}
             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
           >
             <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
             {isExporting ? 'Exportando...' : 'Exportar CSV'}
           </button>
           {canEdit && (
             <button
               onClick={openCreate}
               className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm"
             >
               <Plus className="w-4 h-4" /> Nuevo Producto
             </button>
           )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Producto</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Categoría</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-right">Stock</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-right">Costo / Venta</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-center">Estado</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const stockBadge = getStockBadgeDesc(item.stock);
                const isCritical = item.stock < 10;
                return (
                  <tr key={item.id} className={cn("hover:bg-gray-50/50 transition-colors group", isCritical && "bg-yellow-50/30")}>
                    <td className="px-5 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                          <div className="text-gray-400 text-xs font-bold">IMG</div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">{item.name}</div>
                          <div className="text-[12px] font-mono text-primary truncate mt-0.5">{item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{item.category}</span>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-right">
                      <span className={cn("px-2.5 py-1 rounded-md text-xs font-bold border", stockBadge.className, isCritical ? "border-red-200" : "border-transparent")}>
                        {item.stock} uni
                      </span>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-right">
                      <div className="text-[13px] font-mono text-gray-500 line-through decoration-gray-300">${item.cost.toFixed(2)}</div>
                      <div className="text-sm font-mono font-bold text-gray-900 mt-0.5">${item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-center">
                      {canEdit ? (
                        <button onClick={() => toggleProductoStatus(item.id)} className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors", item.active ? "bg-green-500" : "bg-gray-300")}>
                          <span className={cn("pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition", item.active ? "translate-x-4" : "translate-x-0")} />
                        </button>
                      ) : (
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium", item.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>
                          {item.active ? "Activo" : "Inactivo"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEdit && (
                          <button onClick={() => openEdit(item.id)} className="p-1.5 text-gray-400 hover:text-primary rounded-md transition-colors" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => { deleteProducto(item.id); toast.success(`Producto "${item.name}" eliminado`); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
