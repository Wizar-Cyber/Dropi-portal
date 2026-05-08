import { ArrowLeft, Check, Circle, ExternalLink, MessageCircle, MoreHorizontal, Printer, X, Download } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Pedidos() {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      
      {/* Modal Contactar Cliente */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Contactar a Carlos Mendoza</h3>
              <button onClick={() => setIsContactOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Medio de contacto</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option>WhatsApp (+57 300 123 4567)</option>
                   <option>Email (carlos.m@ejemplo.com)</option>
                 </select>
               </div>
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Mensaje</label>
                 <textarea 
                   rows={4} 
                   defaultValue="Hola Carlos, te contactamos de la tienda respecto a tu pedido #DP-9021. Queríamos informarte que tu paquete..."
                   className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                 />
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

      {/* Modal Imprimir Guía */}
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
                   <div className="absolute top-4 right-4 text-xs">#DP-9021</div>
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/UPC-A-036000291452.svg/1024px-UPC-A-036000291452.svg.png" className="w-48 h-20 object-cover grayscale opacity-80" alt="barcode" />
                   <div className="mt-4 text-[10px] text-center text-gray-600">
                      Carlos Mendoza<br/>
                      Calle 123 #45-67<br/>
                      Bogotá, Colombia<br/>
                      +57 300 123 4567
                   </div>
                </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsPrintOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cerrar
               </button>
               <button onClick={() => { toast.promise(new Promise(r => setTimeout(r, 1000)), { loading: 'Generando PDF', success: 'Descarga iniciada' }); setIsPrintOpen(false); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
                 <Download className="w-4 h-4" /> PDF
               </button>
               <button onClick={() => { setIsPrintOpen(false); toast.success("Enviado a impresora (COM4)"); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2">
                 <Printer className="w-4 h-4" /> Imprimir
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 8 + 4 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Izquierdo (8 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate("/kanban")}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Pedidos
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-mono text-gray-900 m-0">#DP-9021</h1>
                <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wide border border-blue-200">
                  Empacado
                </span>
                <span className="text-sm text-gray-500">24 Oct, 2023 - 14:32</span>
              </div>
              <button 
                onClick={() => setIsContactOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Contactar Cliente
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
             <div className="flex justify-between relative">
                <div className="absolute top-[11px] left-8 right-8 h-0.5 bg-gray-200 z-0"></div>
                <div className="absolute top-[11px] left-8 w-[50%] h-0.5 bg-green-500 z-0"></div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center ring-4 ring-white">
                      <Check className="w-3 h-3 font-bold" />
                   </div>
                   <span className="text-xs font-bold text-gray-900">Pendiente</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center ring-4 ring-white">
                      <Check className="w-3 h-3 font-bold" />
                   </div>
                   <span className="text-xs font-bold text-gray-900">En Preparación</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-primary/20">
                     <Circle className="w-2 h-2 fill-current" />
                   </div>
                   <span className="text-xs font-bold text-primary">Empacado</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center ring-4 ring-white border-2 border-white box-content">
                   </div>
                   <span className="text-xs font-medium text-gray-400">Enviado</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center ring-4 ring-white border-2 border-white box-content">
                   </div>
                   <span className="text-xs font-medium text-gray-400">Entregado</span>
                </div>
             </div>
          </div>

          {/* Tabla Productos */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
               <h3 className="m-0 text-sm font-bold text-gray-900">Productos (2)</h3>
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
                <tr className="hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">IMG</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Audífonos Wireless X-200</div>
                        <div className="text-xs text-gray-500 mt-0.5">Color: Negro</div>
                        <div className="text-[11px] font-mono text-primary mt-1">AU-WRLS-2023-BLK</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-sm">2</td>
                  <td className="px-5 py-4 text-right font-mono text-sm text-gray-600">$89.90</td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-sm text-gray-900">$179.80</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">IMG</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Cargador Rápido 65W GaN</div>
                        <div className="text-xs text-gray-500 mt-0.5">Color: Blanco</div>
                        <div className="text-[11px] font-mono text-primary mt-1">CHG-65W-GAN-WHT</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-sm">1</td>
                  <td className="px-5 py-4 text-right font-mono text-sm text-gray-600">$34.50</td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-sm text-gray-900">$34.50</td>
                </tr>
              </tbody>
            </table>
            
            {/* Footer Financiero */}
            <div className="bg-gray-50 p-5 border-t border-gray-200 flex flex-col items-end gap-2">
              <div className="flex justify-between w-full max-w-[250px] text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-mono">$214.30</span>
              </div>
              <div className="flex justify-between w-full max-w-[250px] text-sm text-gray-600">
                <span>Costo Envío</span>
                <span className="font-mono">$10.00</span>
              </div>
              <div className="flex justify-between w-full max-w-[250px] text-sm text-red-600 font-medium">
                <span>Descuento (DROP5)</span>
                <span className="font-mono">-$5.00</span>
              </div>
              <div className="w-full max-w-[250px] h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between w-full max-w-[250px] text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="font-mono">$219.30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho (4 cols) */}
        <div className="flex flex-col gap-6">
           
           {/* Card Cliente */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="m-0 text-sm font-bold text-gray-900">Cliente</h3>
                <button 
                  onClick={() => toast.success("Cargando perfil del cliente...")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Ver Perfil
                </button>
             </div>
             <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3 relative">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                    AS
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Andrés Silva</div>
                    <div className="text-xs text-gray-500">1 orden total</div>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Información de Contacto</div>
                  <div className="font-medium text-gray-900">andres.silva@example.com</div>
                  <div className="font-medium text-gray-900 mt-1">+57 300 123 4567</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Dirección de Envío</div>
                  <div className="font-medium text-gray-900 leading-tight">
                    Calle 100 #15-20, Apto 402<br />
                    Edificio Los Cerros<br />
                    Bogotá D.C., Colombia
                  </div>
                </div>
                <div className="h-[140px] bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 mt-2 border border-gray-300 overflow-hidden relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0531234741211%2C4.685324546875908%2C-74.0371234741211%2C4.695324546875908&amp;layer=mapnik&amp;marker=4.6903245%2C-74.0451235" 
                    style={{ border: 0 }}
                    title="Mapa Envio"
                  />
                  <div className="absolute inset-0 shadow-inner pointer-events-none rounded-lg" />
                </div>
             </div>
           </div>

           {/* Card Vendedor */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="m-0 text-sm font-bold text-gray-900">Vendedor</h3>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-primary text-[10px] font-bold uppercase tracking-wide border border-blue-200">
                  Dropshipper
                </span>
             </div>
             <div className="p-4 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                 TT
               </div>
               <div className="flex-1 min-w-0">
                 <div className="text-sm font-bold text-gray-900 truncate">Tienda Tech</div>
                 <div className="text-xs text-gray-500"><span className="text-green-600 font-medium">Comisión: $32.89</span> (15%)</div>
               </div>
               <button 
                 onClick={() => toast.success("Cargando perfil del dropshipper...")}
                 className="text-gray-400 hover:text-primary transition-colors"
               >
                 <ExternalLink className="w-4 h-4" />
               </button>
             </div>
           </div>

           {/* Card Acciones */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
             <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase">Cambiar Estado</label>
                  <select className="w-full text-sm bg-gray-50 border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-primary" defaultValue="Empacado">
                    <option>En Preparación</option>
                    <option>Empacado</option>
                    <option>Enviado</option>
                    <option>Entregado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase mt-2">Asignar Operador</label>
                  <select className="w-full text-sm bg-gray-50 border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-primary">
                    <option>Carlos Mendoza (Tú)</option>
                    <option>Laura Castro</option>
                    <option>Sin asignar</option>
                  </select>
                </div>
                <div>
                  <div className="flex flex-col gap-2 mt-4 text-gray-900 font-medium">
                    <button 
                      onClick={() => setIsPrintOpen(true)}
                      className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Printer className="w-4 h-4" /> Imprimir Guía
                    </button>
                    <button 
                      onClick={() => toast.error("Cancelación no permitida en estado 'Empacado'")}
                      className="w-full py-2 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md text-sm text-red-600 flex items-center justify-center gap-2 transition-colors"
                    >
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
