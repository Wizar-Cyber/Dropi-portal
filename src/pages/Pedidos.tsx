import { ArrowLeft, Check, Circle, MessageCircle, Printer, X, Download } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../store";
import { jsPDF } from "jspdf";

export default function Pedidos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get("id");
  const { pedidos, updatePedido, getPedidoTotal } = useAppStore();

  const pedido = pedidoId ? pedidos.find((p) => p.id === pedidoId) : pedidos[0];

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  if (!pedido) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
        <p className="text-lg">Selecciona un pedido desde el Kanban</p>
        <button onClick={() => navigate("/kanban")} className="px-4 py-2 bg-primary text-white rounded-md text-sm">Ir al Kanban</button>
      </div>
    );
  }

  const total = getPedidoTotal(pedido.id);
  const subtotal = pedido.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Guia de Transporte", 20, 20);
    doc.setFontSize(10);
    doc.text(`Pedido: ${pedido.id}`, 20, 35);
    doc.text(`Cliente: ${pedido.client}`, 20, 45);
    doc.text(`Email: ${pedido.clientEmail}`, 20, 55);
    doc.text(`Telefono: ${pedido.clientPhone}`, 20, 65);
    doc.text(`Direccion: ${pedido.clientAddress}`, 20, 75);
    doc.line(20, 85, 190, 85);
    let y = 95;
    doc.text("Producto", 20, y);
    doc.text("Cant", 140, y);
    doc.text("P.U.", 160, y);
    y += 10;
    pedido.items.forEach((item) => {
      doc.text(item.name.slice(0, 30), 20, y);
      doc.text(String(item.qty), 140, y);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 160, y);
      y += 8;
    });
    y += 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, y);
    y += 8;
    doc.text(`Envio: $${pedido.shipping.toFixed(2)}`, 20, y);
    y += 8;
    if (pedido.discount > 0) {
      doc.text(`Descuento: -$${pedido.discount.toFixed(2)}`, 20, y);
      y += 8;
    }
    doc.text(`Total: $${total.toFixed(2)}`, 20, y);
    doc.save(`guia-${pedido.id}.pdf`);
    setIsPrintOpen(false);
    toast.success("PDF descargado");
  };

  const statusColors: Record<string, string> = {
    Pendiente: "bg-yellow-100 text-yellow-700",
    "En Preparación": "bg-blue-100 text-blue-700",
    Empacado: "bg-indigo-100 text-indigo-700",
    Enviado: "bg-green-100 text-green-700",
    Entregado: "bg-green-100 text-green-700",
    Cancelado: "bg-red-100 text-red-700",
  };

  const allStatuses = ["Pendiente", "En Preparación", "Empacado", "Enviado", "Entregado"];
  const currentIdx = allStatuses.indexOf(pedido.status);

  const statusTimeline = allStatuses.map((s, i) => ({
    label: s,
    completed: i < currentIdx,
    current: i === currentIdx,
    future: i > currentIdx,
  }));

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">

      {isContactOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Contactar a {pedido.client}</h3>
              <button onClick={() => setIsContactOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Medio de contacto</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option>WhatsApp ({pedido.clientPhone})</option>
                   <option>Email ({pedido.clientEmail})</option>
                 </select>
               </div>
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Mensaje</label>
                 <textarea rows={4} defaultValue={`Hola ${pedido.client}, te contactamos de la tienda respecto a tu pedido ${pedido.id}.`} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none" />
               </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsContactOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cancelar
               </button>
               <button onClick={() => { setIsContactOpen(false); toast.success("Mensaje enviado con éxito"); }} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2">
                 <MessageCircle className="w-4 h-4" /> Enviar Mensaje
               </button>
            </div>
          </div>
        </div>
      )}

      {isPrintOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Imprimir Guía de Transporte</h3>
              <button onClick={() => setIsPrintOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-gray-50 flex flex-col items-center justify-center gap-4">
                <div className="bg-white border border-gray-300 shadow-sm w-64 h-80 p-4 flex flex-col items-center justify-center relative">
                   <div className="absolute top-4 left-4 text-xs font-bold">ENVÍA</div>
                   <div className="absolute top-4 right-4 text-xs">{pedido.id}</div>
                   <div className="mt-12 text-center text-xs text-gray-600">
                      <strong>{pedido.client}</strong><br/>
                      {pedido.clientAddress}<br/>
                      {pedido.clientPhone}
                   </div>
                </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsPrintOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cerrar
               </button>
               <button onClick={printPDF} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
                 <Download className="w-4 h-4" /> PDF
               </button>
               <button onClick={() => { setIsPrintOpen(false); toast.success("Enviado a impresora"); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2">
                 <Printer className="w-4 h-4" /> Imprimir
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/kanban")}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Kanban
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-mono text-gray-900 m-0">{pedido.id}</h1>
                <span className={cn("px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wide border", statusColors[pedido.status])}>
                  {pedido.status}
                </span>
                <span className="text-sm text-gray-500">{new Date(pedido.createdAt).toLocaleDateString()}</span>
              </div>
              <button onClick={() => setIsContactOpen(true)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <MessageCircle className="w-4 h-4" /> Contactar Cliente
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
             <div className="flex justify-between relative">
                <div className="absolute top-[11px] left-8 right-8 h-0.5 bg-gray-200 z-0"></div>
                {currentIdx >= 0 && <div className="absolute top-[11px] left-8 h-0.5 bg-green-500 z-0" style={{ width: `${(currentIdx / (allStatuses.length - 1)) * 100}%` }}></div>}

                {statusTimeline.map((s, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white",
                      s.completed ? "bg-green-500 text-white" : s.current ? "bg-primary text-white ring-primary/20" : "bg-gray-200 text-gray-400"
                    )}>
                      {s.completed ? <Check className="w-3 h-3" /> : s.current ? <Circle className="w-2 h-2 fill-current" /> : null}
                    </div>
                    <span className={cn("text-xs", (s.completed || s.current) ? "font-bold text-gray-900" : "font-medium text-gray-400")}>{s.label}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
               <h3 className="m-0 text-sm font-bold text-gray-900">Productos ({pedido.items.length})</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-gray-100 hidden sm:table-header-group">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase text-center">Cant</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase text-right">Precio Unitario</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pedido.items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">IMG</div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{item.name}</div>
                          <div className="text-[11px] font-mono text-primary mt-1">{item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-sm">{item.qty}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm text-gray-600">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-sm text-gray-900">${(item.qty * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-gray-50 p-5 border-t border-gray-200 flex flex-col items-end gap-2">
              <div className="flex justify-between w-full max-w-[250px] text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-[250px] text-sm text-gray-600">
                <span>Costo Envío</span>
                <span className="font-mono">${pedido.shipping.toFixed(2)}</span>
              </div>
              {pedido.discount > 0 && (
                <div className="flex justify-between w-full max-w-[250px] text-sm text-red-600 font-medium">
                  <span>Descuento</span>
                  <span className="font-mono">-${pedido.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="w-full max-w-[250px] h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between w-full max-w-[250px] text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="m-0 text-sm font-bold text-gray-900">Cliente</h3>
             </div>
             <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                    {pedido.client.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{pedido.client}</div>
                    <div className="text-xs text-gray-500">{pedido.clientEmail}</div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Teléfono</div>
                  <div className="font-medium text-gray-900">{pedido.clientPhone}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Dirección de Envío</div>
                  <div className="font-medium text-gray-900 leading-tight">{pedido.clientAddress}</div>
                </div>
             </div>
           </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="m-0 text-sm font-bold text-gray-900">Vendedor</h3>
             </div>
             <div className="p-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                 {pedido.vendedorInit}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="text-sm font-bold text-gray-900 truncate">{pedido.vendedor}</div>
                 <div className="text-xs text-gray-500">Comisión: {pedido.commission}%</div>
               </div>
             </div>
           </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
             <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Cambiar Estado</label>
                  <select
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-primary"
                    value={pedido.status}
                    onChange={(e) => { updatePedido(pedido.id, { status: e.target.value as any }); toast.success(`Estado actualizado a ${e.target.value}`); }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Preparación">En Preparación</option>
                    <option value="Empacado">Empacado</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <div className="flex flex-col gap-2 mt-4 text-gray-900 font-medium">
                    <button onClick={() => setIsPrintOpen(true)} className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm flex items-center justify-center gap-2 transition-colors">
                      <Printer className="w-4 h-4" /> Imprimir Guía
                    </button>
                    <button onClick={() => { updatePedido(pedido.id, { status: "Cancelado" }); toast.error("Pedido cancelado"); }} className="w-full py-2 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md text-sm text-red-600 flex items-center justify-center gap-2 transition-colors">
                      <X className="w-4 h-4" /> Cancelar Pedido
                    </button>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
