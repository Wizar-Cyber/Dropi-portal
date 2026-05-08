import { useState } from "react";
import { Search, Plus, Download, Filter, Star, Clock, MoreHorizontal, ExternalLink, X } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

const INITIAL_PROVEEDORES = [
  { id: "1", code: "PROV-001", name: "Global Electronics", category: "Electrónica", products: 145, leadTime: 3, rating: 4.8, status: "Activo", init: "GE" },
  { id: "2", code: "PROV-002", name: "Fashion Wholesale LTDA", category: "Moda", products: 320, leadTime: 5, rating: 4.5, status: "Activo", init: "FW" },
  { id: "3", code: "PROV-003", name: "Mega Distribuciones", category: "Hogar", products: 89, leadTime: 2, rating: 4.9, status: "Activo", init: "MD" },
  { id: "4", code: "PROV-004", name: "Tech Imports", category: "Computación", products: 56, leadTime: 10, rating: 3.8, status: "En Revisión", init: "TI" },
  { id: "5", code: "PROV-005", name: "Accesorios Prime", category: "Accesorios", products: 210, leadTime: 4, rating: 4.2, status: "Inactivo", init: "AP" },
];

export default function Proveedores() {
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const items = INITIAL_PROVEEDORES;

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.code.toLowerCase().includes(search.toLowerCase())
  );

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
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Generando archivo de proveedores...',
        success: 'Archivo descargado correctamente',
        error: 'Ocurrió un error al descargar',
        finally: () => setIsExporting(false)
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      {/* Modal Agregar Proveedor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Agregar Proveedor</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Nombre Público <span className="text-red-500">*</span></label>
                   <input type="text" placeholder="Ej: Mega Distribuciones" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Razón Social <span className="text-red-500">*</span></label>
                   <input type="text" placeholder="Ej: Mega Dist. S.A." className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
               </div>
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Categoría Principal</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option>Electrónica</option>
                   <option>Hogar</option>
                   <option>Moda</option>
                   <option>Mascotas</option>
                   <option>Belleza</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Tiempo de Despacho (Días)</label>
                   <input type="number" defaultValue="2" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Email de Contacto</label>
                   <input type="email" placeholder="ventas@ejemplo.com" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
               </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cancelar
               </button>
               <button onClick={() => { setIsModalOpen(false); toast.success("Proveedor agregado correctamente"); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                 Completar Registro
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Proveedores</h1>
          <p className="text-sm text-gray-500 mt-1">Directorio de fábricas y distribuidores logísticos.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm"
           >
             <Plus className="w-4 h-4" /> Agregar Proveedor
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        {/* Filters */}
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
             <select 
               className="py-2 pl-3 pr-8 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
               onChange={(e) => toast.info(`Mostrando categoría: ${e.target.value}`)}
             >
               <option>Categoría: Todas</option>
               <option>Electrónica</option>
               <option>Moda</option>
               <option>Hogar</option>
             </select>
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
                      <button onClick={() => toast.info(`Cargando perfil de ${item.name}...`)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light rounded-md transition-colors" title="Ver Perfil">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button onClick={() => toast.info(`Opciones para ${item.name}`)} className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md transition-colors" title="Opciones">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
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
