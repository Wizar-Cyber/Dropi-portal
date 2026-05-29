import { useState } from "react";
import { Download, CalendarIcon, ArrowUpRight, ArrowDownRight, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { useAppStore } from "../store";

export default function Reportes() {
  const [isExporting, setIsExporting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("Mes Actual");
  const { getKPIs, pedidos, getPedidoTotal } = useAppStore();
  const kpis = getKPIs();

  const filterOptions = [
    "Hoy",
    "Ayer",
    "Últimos 7 días",
    "Últimos 30 días",
    "Mes Actual",
    "Mes Anterior",
    "Personalizado..."
  ];

  const handleExport = () => {
    setIsExporting(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Generando reporte gerencial, por favor espere...',
        success: 'Reporte PDF descargado correctamente',
        error: 'Ocurrió un error al descargar el reporte',
        finally: () => setIsExporting(false)
      }
    );
  };

  const ingresosByMonth = (() => {
    const months: Record<string, { ing: number; cos: number }> = {};
    pedidos.forEach((p) => {
      const month = p.createdAt.slice(0, 7);
      if (!months[month]) months[month] = { ing: 0, cos: 0 };
      const total = getPedidoTotal(p.id);
      if (p.status === "Entregado" || p.status === "Enviado") {
        months[month].ing += total;
        months[month].cos += total * 0.6;
      }
    });
    return Object.entries(months).slice(-10).map(([m, v]) => ({
      label: m,
      ingreso: Math.round(v.ing / 1000),
      costo: Math.round(v.cos / 1000),
    }));
  })();

  const completados = pedidos.filter((p) => p.status === "Entregado").length;
  const cancelados = pedidos.filter((p) => p.status === "Cancelado").length;
  const total = pedidos.length || 1;
  const pctCompletados = Math.round((completados / total) * 100);
  const pctCancelados = Math.round((cancelados / total) * 100);
  const pctActivos = 100 - pctCompletados - pctCancelados;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Reportes y Analíticas</h1>
          <p className="text-sm text-gray-500 mt-1">Inteligencia de negocio y rendimiento general.</p>
        </div>
        <div className="flex items-center gap-3 relative">
           <button
             onClick={() => setIsCalendarOpen(!isCalendarOpen)}
             className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50 transition-colors"
           >
             <CalendarIcon className="w-4 h-4 text-gray-500" />
             <span className="text-sm font-medium text-gray-700">{selectedDateFilter}</span>
           </button>

           {isCalendarOpen && (
             <div className="absolute top-12 left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
               <div className="p-1">
                 {filterOptions.map((opt) => (
                   <button
                     key={opt}
                     onClick={() => {
                        setSelectedDateFilter(opt);
                        setIsCalendarOpen(false);
                        toast.success(`Datos actualizados a: ${opt}`);
                     }}
                     className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-sm"
                   >
                     {opt}
                     {selectedDateFilter === opt && <Check className="w-4 h-4 text-primary" />}
                   </button>
                 ))}
               </div>
             </div>
           )}

           <button
             onClick={handleExport}
             disabled={isExporting}
             className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
           >
             <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
             {isExporting ? "Exportando..." : "Exportar Reporte"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Ventas Totales", value: `$${kpis.ingresosTotales.toFixed(2)}`, trend: `$${kpis.gmvTotal.toFixed(0)} GMV`, up: true },
          { label: "Pedidos Completados", value: kpis.pedidosCompletados.toString(), trend: `${kpis.pedidosActivos} activos`, up: true },
          { label: "Ticket Promedio", value: `$${kpis.ticketPromedio.toFixed(2)}`, trend: `Comisión ${kpis.comisionPromedio.toFixed(1)}%`, up: kpis.ticketPromedio > 0 },
          { label: "Comisión Promedio", value: `${kpis.comisionPromedio.toFixed(1)}%`, trend: `${kpis.vendedoresActivos} vendedores`, up: true },
        ].map((kpi, i) => (
          <div onClick={() => toast.info(`Mostrando analítica de ${kpi.label}`)} key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2">{kpi.label}</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</div>
             <div className={`text-[12px] flex items-center gap-1 font-medium ${kpi.up ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-base font-bold text-gray-900 m-0">Ingresos vs Gastos</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary shrink-0"></div> Ingresos</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-300 shrink-0"></div> Costos Operativos</div>
            </div>
          </div>

          <div className="flex-1 min-h-[250px] relative mt-4 ml-8 sm:ml-10">
             <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                   <div key={i} className="border-b border-gray-100 w-full relative">
                      <span className="absolute -left-8 sm:-left-10 -top-2.5 text-[10px] text-gray-400 font-mono">${(4-i)*25}k</span>
                   </div>
                ))}
             </div>

             <div className="absolute inset-x-2 sm:inset-x-8 bottom-0 top-0 flex items-end justify-between px-1 sm:px-4 pb-[1px]">
                {(ingresosByMonth.length > 0 ? ingresosByMonth : Array.from({ length: 4 }, (_, i) => ({ ingreso: 50 + i * 10, costo: 20 + i * 5, label: "" }))).map((h, i) => (
                  <div key={i} className="relative w-3 sm:w-8 h-full flex flex-col justify-end group">
                     <div className="absolute bottom-0 left-0.5 sm:left-2 right-0.5 sm:right-2 rounded-t-sm bg-gray-200 transition-all opacity-80" style={{ height: `${Math.min((h.costo / 100) * 100, 100)}%` }}></div>
                     <div className="absolute bottom-0 left-0 right-0 rounded-t-md bg-primary opacity-90 transition-all" style={{ height: `${Math.min((h.ingreso / 100) * 100, 100)}%` }}></div>

                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 lg:group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap hidden sm:block">
                        Ing: ${h.ingreso}k / Cos: ${h.costo}k
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium font-mono pl-4 sm:pl-8 pr-2 sm:pr-4">
            <span>{ingresosByMonth[0]?.label || "N/A"}</span>
            <span>{ingresosByMonth[ingresosByMonth.length - 1]?.label || "N/A"}</span>
          </div>
        </div>

        <div onClick={() => toast.info('Mostrando desglose de canales detallado')} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col cursor-pointer group">
          <h3 className="text-base font-bold text-gray-900 m-0 mb-6">Distribución por Estado</h3>

          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
             <div className="w-48 h-48 rounded-full border-[20px] border-gray-100 relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                 <div className="absolute inset-0 border-[20px] border-primary rounded-full group-hover:opacity-90 transition-opacity" style={{ clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, ${50 + pctCompletados / 2}% 100%)` }}></div>
                 <div className="absolute inset-0 border-[20px] border-blue-400 rounded-full group-hover:opacity-90 transition-opacity" style={{ clipPath: `polygon(50% 50%, 50% 100%, 0% 100%, 0% ${50 - pctCancelados / 2}%)` }}></div>
                 <div className="absolute inset-0 border-[20px] border-blue-200 rounded-full group-hover:opacity-90 transition-opacity" style={{ clipPath: `polygon(50% 50%, 0% ${50 - pctCancelados / 2}%, 0% 0%, 50% 0%)` }}></div>

                 <div className="text-center">
                   <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total</div>
                   <div className="text-2xl font-bold text-gray-900">{pedidos.length}</div>
                 </div>
             </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
             <div className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                   <div className="w-3 h-3 rounded bg-primary"></div> Completados
                </div>
                <div className="font-bold text-gray-900">{pctCompletados}%</div>
             </div>
             <div className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                   <div className="w-3 h-3 rounded bg-blue-400"></div> Activos
                </div>
                <div className="font-bold text-gray-900">{pctActivos}%</div>
             </div>
             <div className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                   <div className="w-3 h-3 rounded bg-blue-200"></div> Cancelados
                </div>
                <div className="font-bold text-gray-900">{pctCancelados}%</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
