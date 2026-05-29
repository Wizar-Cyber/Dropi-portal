import { Clock, MoreHorizontal, User, CheckCircle2, Ticket, X, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAppStore, type PedidoEstado } from "../store";
import { jsPDF } from "jspdf";

const KANBAN_COLS: { id: PedidoEstado; title: string; color: string; border: string }[] = [
  { id: "Pendiente", title: "Pendiente", color: "bg-gray-100", border: "border-gray-200" },
  { id: "En Preparación", title: "En Preparación", color: "bg-yellow-50", border: "border-yellow-200" },
  { id: "Empacado", title: "Empacado", color: "bg-blue-50", border: "border-blue-200" },
  { id: "Enviado", title: "Enviado", color: "bg-green-50", border: "border-green-200" },
];

const NEXT_STATUS: Record<PedidoEstado, PedidoEstado | null> = {
  "Pendiente": "En Preparación",
  "En Preparación": "Empacado",
  "Empacado": "Enviado",
  "Enviado": "Entregado",
  "Entregado": null,
  "Cancelado": null,
};

const PREV_STATUS: Record<PedidoEstado, PedidoEstado | null> = {
  "Pendiente": null,
  "En Preparación": "Pendiente",
  "Empacado": "En Preparación",
  "Enviado": "Empacado",
  "Entregado": "Enviado",
  "Cancelado": null,
};

export default function Kanban() {
  const navigate = useNavigate();
  const { pedidos, movePedido, authUser } = useAppStore();
  const [autoAssign, setAutoAssign] = useState(true);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const pedidosByStatus = (status: PedidoEstado) =>
    pedidos.filter((p) => p.status === status);

  const handleMove = (id: string, status: PedidoEstado) => {
    movePedido(id, status);
    toast.success(`Pedido ${id} movido a ${status}`);
  };

  const generatePDF = () => {
    const empacados = pedidosByStatus("Empacado");
    if (empacados.length === 0) {
      toast.error("No hay pedidos empacados para generar guías");
      return;
    }
    const doc = new jsPDF();
    empacados.forEach((pedido, i) => {
      if (i > 0) doc.addPage();
      doc.setFontSize(16);
      doc.text("Guia de Transporte", 20, 20);
      doc.setFontSize(10);
      doc.text(`Pedido: ${pedido.id}`, 20, 35);
      doc.text(`Cliente: ${pedido.client}`, 20, 45);
      doc.text(`Direccion: ${pedido.clientAddress}`, 20, 55);
      doc.text(`Telefono: ${pedido.clientPhone}`, 20, 65);
      doc.text(`Vendedor: ${pedido.vendedor}`, 20, 75);
      doc.line(20, 85, 190, 85);
      let y = 95;
      doc.text("SKU", 20, y);
      doc.text("Producto", 50, y);
      doc.text("Cant", 140, y);
      doc.text("P.U.", 160, y);
      y += 10;
      pedido.items.forEach((item) => {
        doc.text(item.sku, 20, y);
        doc.text(item.name.slice(0, 25), 50, y);
        doc.text(String(item.qty), 140, y);
        doc.text(`$${item.unitPrice.toFixed(2)}`, 160, y);
        y += 8;
      });
      y += 10;
      doc.text(`Total: $${(pedido.items.reduce((s, i) => s + i.qty * i.unitPrice, 0) + pedido.shipping - pedido.discount).toFixed(2)}`, 20, y);
    });
    doc.save(`guias-transporte-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success(`${empacados.length} guías generadas`);
    setIsBulkOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-88px)] w-full relative">
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
               <p className="text-sm text-gray-600">Tienes <strong>{pedidosByStatus("Empacado").length} pedidos empacados</strong> listos para generar guía. ¿Deseas enviarlos ahora a la transportadora?</p>
               <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                 <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                   <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4" />
                   Descargar PDF consolidado ({pedidosByStatus("Empacado").length} guías)
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
                 onClick={generatePDF}
                 className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2"
               >
                 <Ticket className="w-4 h-4" /> Generar Guías Masivas
               </button>
            </div>
          </div>
        </div>
      )}

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
                 toast.success(`Asignación automática ${newVal ? 'activada' : 'desactivada'}`);
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

      <div className="flex gap-4 h-full overflow-x-auto pb-4 items-start">
        {KANBAN_COLS.map((col) => {
          const cards = pedidosByStatus(col.id);
          return (
            <div key={col.id} className={cn("flex flex-col min-w-[280px] w-[320px] rounded-xl border p-3 shrink-0 max-h-full", col.color, col.border)}>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-gray-900 m-0 text-sm">{col.title}</h3>
                <span className="bg-white/60 text-gray-700 px-2 rounded-full text-xs font-bold border border-gray-200/50">
                  {cards.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1 kanban-scroll">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm hover:border-primary/40 transition-colors"
                  >
                     <div className="flex items-center justify-between mb-2">
                       <span
                         onClick={() => navigate(`/pedidos?id=${card.id}`)}
                         className="text-xs font-bold font-mono text-primary bg-primary-light/50 px-1.5 py-0.5 rounded cursor-pointer hover:underline"
                       >
                         {card.id}
                       </span>
                       <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium">
                         <Clock className="w-3 h-3" />
                         {new Date(card.createdAt).toLocaleDateString()}
                       </div>
                     </div>

                     <div className="mb-3">
                       <div className="font-bold text-gray-900 text-sm mb-1">{card.client}</div>
                       <div className="text-xs text-gray-500 leading-snug">
                         <span className="font-medium text-gray-700">{card.items.length} ítems</span>
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
                             const init = authUser?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
                             movePedido(card.id, { assigned: init } as any);
                             toast.success("Pedido asignado a ti correctamente");
                           }}
                           className="text-[11px] font-bold text-primary bg-primary-light px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
                         >
                           Tomar Pedido
                         </button>
                       )}

                       <div className="flex items-center gap-1">
                         {PREV_STATUS[col.id] && (
                           <button
                             onClick={(e) => { e.stopPropagation(); handleMove(card.id, PREV_STATUS[col.id]!); }}
                             className="text-gray-400 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                             title={`Mover a ${PREV_STATUS[col.id]}`}
                           >
                             <ChevronLeft className="w-4 h-4" />
                           </button>
                         )}
                         {NEXT_STATUS[col.id] && (
                           <button
                             onClick={(e) => { e.stopPropagation(); handleMove(card.id, NEXT_STATUS[col.id]!); }}
                             className="text-gray-400 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                             title={`Mover a ${NEXT_STATUS[col.id]}`}
                           >
                             <ChevronRight className="w-4 h-4" />
                           </button>
                         )}
                       </div>
                     </div>
                  </div>
                ))}

                {cards.length === 0 && (
                  <div className="text-center text-xs text-gray-400 py-6">Sin pedidos</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
