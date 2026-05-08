import { useState } from "react";
import { Search, Download, Plus, Filter, MoreHorizontal, Pencil, Trash2, Camera, X } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

const INITIAL_INVENTORY = [
  { id: "1", sku: "AU-WRLS-2023", name: "Audífonos Wireless X-200", category: "Electrónica", stock: 5, cost: 45.00, price: 89.90, active: true },
  { id: "2", sku: "WAT-NEO-V3", name: "Reloj Inteligente V3 Neo", category: "Accesorios", stock: 12, cost: 110.00, price: 199.00, active: true },
  { id: "3", sku: "CHG-65W-GAN", name: "Cargador Rápido 65W GaN", category: "Electrónica", stock: 150, cost: 18.50, price: 34.50, active: true },
  { id: "4", sku: "KB-MECH-RGB", name: "Teclado Mecánico RGB", category: "Computación", stock: 8, cost: 52.00, price: 115.00, active: false },
  { id: "5", sku: "CAM-4K-PRO", name: "Cámara de Seguridad 4K", category: "Hogar", stock: 45, cost: 35.00, price: 79.99, active: true },
];

export default function Inventario() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.active;
          toast.success(`Producto ${newStatus ? 'activado' : 'desactivado'} correctamente`);
          return { ...item, active: newStatus };
        }
        return item;
      })
    );
  };

  const getStockBadgeDesc = (stock: number) => {
    if (stock < 10) return { label: "Stock Crítico", className: "bg-red-100 text-red-700" };
    if (stock < 20) return { label: "Stock Bajo", className: "bg-yellow-100 text-yellow-700" };
    return { label: "Disponible", className: "bg-green-100 text-green-700" };
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Generando archivo CSV...',
        success: 'Inventario exportado exitosamente',
        error: 'No se pudo exportar',
        finally: () => setIsExporting(false)
      }
    );
  };

  const handleDelete = (id: string, name: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.error(`Producto "${name}" eliminado`);
  };

  const handleScanSimulate = () => {
    setIsScanning(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Activando cámara para escaneo de código de barras...',
        success: () => {
          setIsScanning(false);
          setIsModalOpen(false);
          return 'Código detectado: 739284910. Producto encontrado en catálogo global.';
        },
        error: 'No se detectó cámara o producto',
      }
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      {/* Nuevo Producto Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col mt-[-100px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Agregar Nuevo Producto</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-gray-700">Ingrese SKU / ID del producto</label>
                 <input type="text" placeholder="Ej: PRD-9982" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono" />
               </div>
               
               <div className="relative flex items-center justify-center py-2">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                 <span className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase">Ó ESCANEAR</span>
               </div>
               
               <button 
                 onClick={handleScanSimulate}
                 disabled={isScanning}
                 className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all text-gray-500 hover:text-primary group disabled:opacity-50 disabled:pointer-events-none"
               >
                 <div className={cn("p-4 rounded-full bg-gray-50 group-hover:bg-primary/10 transition-colors", isScanning && "animate-pulse")}>
                   <Camera className="w-8 h-8" />
                 </div>
                 <span className="text-sm font-medium">{isScanning ? "Inicializando escáner..." : "Escanear Código de Barras"}</span>
               </button>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cancelar
               </button>
               <button onClick={() => { setIsModalOpen(false); toast.success("Buscando producto..."); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                 Buscar Producto
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 m-0">Inventario</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold border border-gray-200">
            {items.length} totales
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
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm"
           >
             <Plus className="w-4 h-4" /> Nuevo Producto
           </button>
        </div>
      </div>

      {/* Filters */}
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
        <div className="flex items-center gap-3">
           <select 
             className="py-2 pl-3 pr-8 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
             onChange={(e) => toast.success(`Filtro de categoría: ${e.target.value || 'Todas'}`)}
           >
             <option>Todas las categorías</option>
             <option>Electrónica</option>
             <option>Accesorios</option>
             <option>Computación</option>
           </select>
           <select 
             className="py-2 pl-3 pr-8 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
             onChange={(e) => toast.success(`Filtro de stock: ${e.target.value}`)}
           >
             <option>Stock: Todos</option>
             <option>Bajo Stock</option>
             <option>Agotado</option>
           </select>
           <button 
             onClick={() => toast.info("Abriendo filtros avanzados...")}
             className="p-2 text-gray-500 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors" 
             title="Más filtros"
           >
             <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 border-b border-gray-200 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary/20" />
                </th>
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
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary/20" />
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {/* Thumbnail Placeholder */}
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
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          item.active ? "bg-green-500" : "bg-gray-300"
                        )}
                      >
                        <span className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            item.active ? "translate-x-4" : "translate-x-0"
                          )} 
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-200 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toast.info(`Editando ${item.name}`)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-light rounded-md transition-colors" 
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
           <span className="text-xs text-gray-500 font-medium">Mostrando {filteredItems.length} de {items.length} resultados</span>
           <div className="flex items-center gap-1">
              <button 
                onClick={() => toast.info("Cargando página anterior...")}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled
              >Anterior</button>
              <button 
                onClick={() => toast.info("Cargando página siguiente...")}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
              >Siguiente</button>
           </div>
        </div>
      </div>
    </div>
  );
}
