import { useState } from "react";
import { useForm } from "react-hook-form";
import { Search, Plus, Download, Star, Clock, MoreHorizontal, X, Pencil } from "lucide-react";
import { cn } from "../lib/utils";
import { useAppStore, can, exportToCSV } from "../store";
import { toast } from "sonner";

interface ProveedorForm {
  name: string;
  razonSocial: string;
  category: string;
  leadTime: number;
  email: string;
  status: "Activo" | "Inactivo" | "En Revisión";
}

export default function Proveedores() {
  const { proveedores, authUser, addProveedor, updateProveedor, deleteProveedor } = useAppStore();
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProveedorForm>();

  const canEdit = authUser ? can(authUser.role, "editar") : false;
  const canDelete = authUser ? can(authUser.role, "eliminar") : false;

  const filteredItems = proveedores.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    reset({ name: "", razonSocial: "", category: "Electrónica", leadTime: 3, email: "", status: "Activo" });
    setIsModalOpen(true);
  };

  const openEdit = (id: string) => {
    const p = proveedores.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setValue("name", p.name);
    setValue("razonSocial", p.razonSocial);
    setValue("category", p.category);
    setValue("leadTime", p.leadTime);
    setValue("email", p.email);
    setValue("status", p.status);
    setIsModalOpen(true);
  };

  const onSubmit = (data: ProveedorForm) => {
    if (editingId) {
      updateProveedor(editingId, data);
      toast.success("Proveedor actualizado");
    } else {
      addProveedor({ ...data, products: 0, rating: 0 });
      toast.success("Proveedor agregado correctamente");
    }
    setIsModalOpen(false);
    reset();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Activo": return "bg-green-100 text-green-700";
      case "Inactivo": return "bg-gray-100 text-gray-700";
      case "En Revisión": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportToCSV(proveedores as any, "proveedores");
      setIsExporting(false);
      toast.success("Proveedores exportados");
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">{editingId ? "Editar Proveedor" : "Agregar Proveedor"}</h3>
              <button onClick={() => { setIsModalOpen(false); reset(); }} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Nombre Público <span className="text-red-500">*</span></label>
                     <input type="text" {...register("name", { required: true })} placeholder="Ej: Mega Distribuciones" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Razón Social <span className="text-red-500">*</span></label>
                     <input type="text" {...register("razonSocial", { required: true })} placeholder="Ej: Mega Dist. S.A." className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                 </div>
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Categoría Principal</label>
                   <select {...register("category")} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                     <option>Electrónica</option>
                     <option>Hogar</option>
                     <option>Moda</option>
                     <option>Accesorios</option>
                     <option>Computación</option>
                   </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Tiempo de Despacho (Días)</label>
                     <input type="number" {...register("leadTime", { min: 1 })} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                   <div className="flex flex-col gap-1.5 text-left">
                     <label className="text-sm font-bold text-gray-700">Email de Contacto</label>
                     <input type="email" {...register("email")} placeholder="ventas@ejemplo.com" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                 </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button type="button" onClick={() => { setIsModalOpen(false); reset(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                   Cancelar
                 </button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                   {editingId ? "Actualizar" : "Completar Registro"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Proveedores</h1>
          <p className="text-sm text-gray-500 mt-1">Directorio de fábricas y distribuidores logísticos.</p>
        </div>
        <div className="flex items-center gap-3">
           {canEdit && (
             <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm">
               <Plus className="w-4 h-4" /> Agregar Proveedor
             </button>
           )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={handleExport}
               disabled={isExporting}
               className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
             >
               <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
               {isExporting ? "Exportando..." : "Exportar"}
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 w-16">Siglas</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Proveedor</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Categoría</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-center">Productos</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-center">Lead Time</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-center">Calificación</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-center">Estado</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-3 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center text-sm font-bold shrink-0">
                      {item.init}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{item.name}</div>
                      <div className="text-[12px] font-mono text-gray-500 truncate mt-0.5">{item.code}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-center text-sm font-bold text-gray-900">
                    {item.products}
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {item.leadTime} días
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-sm text-gray-900">
                      {item.rating} <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-center">
                    <span className={cn("px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide", getStatusBadge(item.status))}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canEdit && (
                        <button onClick={() => openEdit(item.id)} className="p-1.5 text-gray-400 hover:text-primary rounded-md transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => { deleteProveedor(item.id); toast.success(`${item.name} eliminado`); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors" title="Eliminar">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No se encontraron proveedores que coincidan con la búsqueda.
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
