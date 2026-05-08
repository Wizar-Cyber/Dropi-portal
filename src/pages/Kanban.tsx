import { Clock, MoreHorizontal, User, CheckCircle2, Ticket, X } from "lucide-react";
import { cn } from "../lib/utils";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const KANBAN_COLS = [
  { id: "pendiente", title: "Pendiente", color: "bg-gray-100", border: "border-gray-200", count: 12 },
  { id: "preparacion", title: "En Preparación", color: "bg-yellow-50", border: "border-yellow-200", count: 8 },
  { id: "empacado", title: "Empacado", color: "bg-blue-50", border: "border-blue-200", count: 24 },
  { id: "enviado", title: "Enviado", color: "bg-green-50", border: "border-green-200", count: 156 },
];

const MOCK_CARDS = {
  pendiente: [
    { id: "DP-9025", time: "hace 10m", client: "Fernando Ruiz", itemsText: "Camiseta x2, Audífonos x1", items: 3, assigned: null },
    { id: "DP-9024", time: "hace 45m", client: "Sofía Vergara", itemsText: "Reloj Inteligente x1", items: 1, assigned: null },
    { id: "DP-9023", time: "hace 1h", client: "Miguel Torres", itemsText: "Teclado RGB x1", items: 1, assigned: "LM" },
  ],
  preparacion: [
    { id: "DP-9022", time: "hace 2h", client: "Lucía Gómez", itemsText: "Cargador 65W x3", items: 3, assigned: "CM" },
    { id: "DP-9021", time: "hace 2h 15m", client: "Andrés Silva", itemsText: "Audífonos x2, Cargador x1", items: 3, assigned: "CM" },
  ],
  empacado: [
    { id: "DP-9019", time: "hace 4h", client: "Carlos Vives", itemsText: "Cámara 4K x1", items: 1, assigned: "LM" },
    { id: "DP-9017", time: "hace 5h", client: "Patricia López", itemsText: "Reloj Inteligente x2", items: 2, assigned: "CM" },
  ],
  enviado: [
    { id: "DP-9010", time: "hace 1d", client: "Juan Diego", itemsText: "Camiseta x1", items: 1, assigned: "CM" },
  ]
};

export default function Kanban() {
  const navigate = useNavigate();
  const [autoAssign, setAutoAssign] = useState(true);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-88px)] w-full relative">
      {/* Modal Acciones Masivas */}
      {isBulkOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Creación Masiva de Guías</h3>
              <button onClick={() => setIsBulkOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
               <p className="text-sm text-gray-600">Tienes <strong>24 pedidos empacados</strong> listos para generar guía. ¿Deseas enviarlos ahora a la transportadora?</p>
               <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                 <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                   <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4" />
                   Descargar PDF consolidado (24 guías)
                 </label>
                 <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                   <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4" />
                   Pasar pedidos automáticamente a "Enviado"
                 </label>
               </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsBulkOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cancelar
               </button>
               <button 
                 onClick={() => { 
                   setIsBulkOpen(false); 
                   toast.promise(new Promise(r => setTimeout(r, 2000)), { loading: 'Generando guías...', success: 'Guías generadas correctamente (PDF descargado)' });
                 }} 
                 className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2"
               >
                 <Ticket className="w-4 h-4" /> Generar Guías Masivas
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Logística Kanban</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión visual del flujo de despacho de pedidos.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
             <span className="text-xs text-gray-400 font-medium">Asignación automática:</span>
             <button 
               onClick={() => {
                 const newVal = !autoAssign;
                 setAutoAssign(newVal);
                 import("sonner").then(({ toast }) => toast.success(`Asignación automática ${newVal ? 'activada' : 'desactivada'}`));
               }}
               className={cn(
                 "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                 autoAssign ? "bg-green-500" : "bg-gray-300"
               )}
             >
               <span className={cn(
                 "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                 autoAssign ? "translate-x-4" : "translate-x-0"
               )}></span>
             </button>
          </div>
          <button 
            onClick={() => setIsBulkOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm"
          >
            Crear Etiqueta Masiva
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 h-full overflow-x-auto pb-4 items-start">
        {KANBAN_COLS.map((col) => (
          <div key={col.id} className={cn("flex flex-col min-w-[280px] w-[320px] rounded-xl border p-3 shrink-0 max-h-full", col.color, col.border)}>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-gray-900 m-0 text-sm">{col.title}</h3>
              <span className="bg-white/60 text-gray-700 px-2 rounded-full text-xs font-bold border border-gray-200/50">
                {col.count}
              </span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1 kanban-scroll">
              {(MOCK_CARDS as any)[col.id].map((card: any, index: number) => (
                <div 
                  key={index} 
                  onClick={() => navigate("/pedidos")}
                  className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm cursor-pointer hover:border-primary/40 transition-colors"
                >
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-bold font-mono text-primary bg-primary-light/50 px-1.5 py-0.5 rounded">{card.id}</span>
                     <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium">
                       <Clock className="w-3 h-3" />
                       {card.time}
                     </div>
                   </div>
                   
                   <div className="mb-3">
                     <div className="font-bold text-gray-900 text-sm mb-1">{card.client}</div>
                     <div className="text-xs text-gray-500 leading-snug">
                       <span className="font-medium text-gray-700">{card.items} ítems:</span> {card.itemsText}
                     </div>
                   </div>

                   <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                     {card.assigned ? (
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold">
                           {card.assigned}
                         </div>
                         <span className="text-xs text-gray-500 font-medium">Asignado</span>
                       </div>
                     ) : (
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           import("sonner").then(({ toast }) => toast.success("Pedido asignado a ti correctamente"));
                         }}
                         className="text-[11px] font-bold text-primary bg-primary-light px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
                       >
                         Tomar Pedido
                       </button>
                     )}
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         import("sonner").then(({ toast }) => toast.info("Opciones del pedido"));
                       }}
                       className="text-gray-400 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                     >
                       <MoreHorizontal className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              ))}

              {col.id === "pendiente" && (
                <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-900 hover:border-gray-400 transition-all">
                  + Mover tarea aquí
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
