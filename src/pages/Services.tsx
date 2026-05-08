import { useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

// Mock data
const INITIAL_SERVICES = [
  { id: "1", name: "Consulta de Cardiología", duration: "45 min", price: 85000, active: true },
  { id: "2", name: "Ecocardiograma Doppler", duration: "30 min", price: 120000, active: true },
  { id: "3", name: "Prueba de Esfuerzo", duration: "1h 30m", price: 150000, active: false },
  { id: "4", name: "Holter de Arritmia 24h", duration: "30 min", price: 95000, active: true },
];

export default function Services() {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Modal Nuevo Servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Añadir Nuevo Servicio</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Nombre del Servicio <span className="text-red-500">*</span></label>
                 <input type="text" placeholder="Ej: Consulta General" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Duración <span className="text-red-500">*</span></label>
                   <select className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                     <option>15 min</option>
                     <option>30 min</option>
                     <option>45 min</option>
                     <option>1 hora</option>
                     <option>1 hora 30 min</option>
                     <option>2 horas</option>
                   </select>
                 </div>
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Precio (COP) <span className="text-red-500">*</span></label>
                   <input type="number" placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
               </div>
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Descripción (Opcional)</label>
                 <textarea rows={3} placeholder="Detalles sobre el servicio..." className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"></textarea>
               </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cancelar
               </button>
               <button onClick={() => { setIsModalOpen(false); toast.success("Servicio añadido correctamente"); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                 Guardar Servicio
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold m-0 leading-none">Gestión de Servicios</h2>
          <span className="text-gray-400 leading-none">/</span>
          <span className="text-gray-500 text-sm leading-none">Administra los servicios ofrecidos por la clínica</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 font-medium rounded-md text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Añadir Servicio
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="m-0 text-base font-semibold">Inventario de Servicios</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-600 px-5 py-3 border-b border-gray-200 uppercase tracking-wide">Nombre del Servicio</th>
                <th className="text-left text-xs font-medium text-gray-600 px-5 py-3 border-b border-gray-200 uppercase tracking-wide">Duración</th>
                <th className="text-left text-xs font-medium text-gray-600 px-5 py-3 border-b border-gray-200 uppercase tracking-wide">Precio</th>
                <th className="text-left text-xs font-medium text-gray-600 px-5 py-3 border-b border-gray-200 uppercase tracking-wide">Estado</th>
                <th className="text-right text-xs font-medium text-gray-600 px-5 py-3 border-b border-gray-200 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-5 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {service.name}
                  </td>
                  <td className="px-5 py-3 text-[13px] font-mono text-primary border-b border-gray-200">{service.duration}</td>
                  <td className="px-5 py-3 text-[13px] font-mono border-b border-gray-200">
                    {formatPrice(service.price)}
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          service.active ? "bg-success-text" : "bg-gray-300"
                        )}
                        role="switch"
                        aria-checked={service.active}
                      >
                        <span className="sr-only">Toggle state</span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            service.active ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                      <span className={cn(
                        "ml-3 px-2 py-0.5 rounded text-[11px] font-medium uppercase",
                        service.active ? "bg-success-bg text-success-text" : "bg-danger-bg text-danger-text"
                      )}>
                        {service.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right border-b border-gray-200">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toast.info(`Editar ${service.name} en construcción`)} className="p-1.5 text-gray-400 hover:text-primary rounded-md transition-colors" title="Editar">
                        <Pencil className="size-4" />
                      </button>
                      <button onClick={() => toast.success(`Servicio ${service.name} eliminado (simulado)`)} className="p-1.5 text-gray-400 hover:text-danger-text rounded-md transition-colors" title="Eliminar">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500 border-b border-gray-200 text-sm">
                    No se encontraron servicios que coincidan con la búsqueda.
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
