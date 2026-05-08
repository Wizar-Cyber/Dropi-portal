import { useState } from "react";
import { Search, Download, Plus, Filter, MoreHorizontal, ExternalLink, TrendingUp, TrendingDown, X } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

const INITIAL_VENDEDORES = [
  { id: "1", name: "Juan Pérez", company: "DropKing", orders: 345, gmv: 34500.50, commission: 15.5, status: "Activo", lastActive: "Hace 5 min", init: "JP", trend: "up" },
  { id: "2", name: "Tienda Tech", company: "Tech Store LC", orders: 289, gmv: 28900.00, commission: 12.0, status: "Activo", lastActive: "Hace 1 hora", init: "TT", trend: "up" },
  { id: "3", name: "María Gómez", company: "Moda Express", orders: 150, gmv: 15050.25, commission: 18.2, status: "Activo", lastActive: "Hace 2 horas", init: "MG", trend: "down" },
  { id: "4", name: "Carlos López", company: "Accesorios CL", orders: 45, gmv: 4500.00, commission: 10.0, status: "Inactivo", lastActive: "Hace 5 días", init: "CL", trend: "down" },
  { id: "5", name: "Super Ofertas", company: "Ofertas INC", orders: 89, gmv: 8900.80, commission: 14.5, status: "Pendiente", lastActive: "Nunca", init: "SO", trend: "none" },
];

export default function Vendedores() {
  const [search, setSearch] = useState("");
  const [items] = useState(INITIAL_VENDEDORES);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Activo": return "bg-green-100 text-green-700";
      case "Inactivo": return "bg-gray-100 text-gray-700";
      case "Pendiente": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Generando reporte de vendedores...',
        success: 'Archivo exportado correctamente',
        error: 'Ocurrió un error al exportar',
        finally: () => setIsExporting(false)
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      {/* Modal Nuevo Vendedor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Añadir Nuevo Vendedor</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Nombre Completo <span className="text-red-500">*</span></label>
                   <input type="text" placeholder="Ej: Pedro Álvarez" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Empresa/Tienda <span className="text-red-500">*</span></label>
                   <input type="text" placeholder="Ej: TechStore Lda" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
               </div>
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Ingresos Mensuales Obj. (GMV)</label>
                 <input type="text" placeholder="Ej: $10,000" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
               </div>
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Plan Asignado</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option>Standard (10%)</option>
                   <option>Pro (15%)</option>
                   <option>Elite (20%)</option>
                 </select>
               </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cancelar
               </button>
               <button onClick={() => { setIsModalOpen(false); toast.success("Vendedor añadido correctamente"); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                 Guardar Vendedor
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Vendedores</h1>
          <p className="text-sm text-gray-500 mt-1">Directorio y métricas de la red de dropshipping.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm"
           >
             <Plus className="w-4 h-4" /> Nuevo Vendedor
           </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Vendedores", value: "1,248" },
          { label: "GMV Mensual", value: "$4.2M" },
          { label: "Vendedores Activos", value: "892" },
          { label: "Comisión Promedio", value: "14.8%" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</div>
              <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
            </div>
            {i !== 3 && <TrendingUp className="w-4 h-4 text-green-500 opacity-50" />}
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        {/* Filters */}
        <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <select 
               className="py-2 pl-3 pr-8 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
               onChange={(e) => toast.success(`Filtro aplicado: ${e.target.value}`)}
             >
               <option>Estado: Todos</option>
               <option>Activos</option>
               <option>Inactivos</option>
               <option>Pendientes</option>
             </select>
             <button 
               onClick={handleExport}
               disabled={isExporting}
               className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
             >
               <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} /> 
               {isExporting ? 'Exportando...' : 'Exportar'}
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Vendedor</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-right">Pedidos (Mes)</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-right">GMV (COP)</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-center">Comisión</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-center">Estado</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200">Última Actividad</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-200 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold shrink-0">
                        {item.init}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{item.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-bold text-gray-900">{item.orders}</span>
                      {item.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
                      {item.trend === "down" && <TrendingDown className="w-3 h-3 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-right">
                    <span className="font-mono text-sm text-gray-700">${item.gmv.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-center font-bold text-sm">
                    {item.commission}%
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-center">
                    <span className={cn("px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide", getStatusBadge(item.status))}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-sm text-gray-500">
                    {item.lastActive}
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toast.info(`Abriendo perfil de ${item.name}`)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light rounded-md transition-colors" 
                        title="Ver Perfil"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toast.success(`Mostrando acciones para ${item.company}`)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md transition-colors" 
                        title="Opciones"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
