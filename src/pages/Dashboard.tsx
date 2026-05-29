import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, AlertCircle, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { cn } from "../lib/utils";
import { useAppStore } from "../store";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("30D");
  const { pedidos, vendedores, getKPIs, getTopVendedores, getRecentPedidos, getPedidoTotal } = useAppStore();
  const kpis = getKPIs();
  const topVendedores = getTopVendedores();
  const recentPedidos = getRecentPedidos();

  const chartData = useMemo(() => {
    const days = dateRange === "7D" ? 7 : dateRange === "30D" ? 30 : 365;
    const groups: Record<string, number> = {};
    const now = new Date();
    pedidos.forEach((p) => {
      const d = new Date(p.createdAt);
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diff < days) {
        const key = d.toISOString().slice(0, 10);
        groups[key] = (groups[key] || 0) + getPedidoTotal(p.id);
      }
    });
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = dateRange === "7D" ? d.toLocaleDateString("es", { weekday: "short" }) : `${d.getDate()}/${d.getMonth() + 1}`;
      result.push({ name: label, value: groups[key] || 0 });
    }
    return result;
  }, [pedidos, dateRange, getPedidoTotal]);

  const totalPedidos = pedidos.length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => toast.info(`Ingresos Totales: $${kpis.ingresosTotales.toFixed(2)}`)} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Ingresos Totales</div>
              <div className="text-2xl font-bold text-gray-900">${kpis.ingresosTotales.toFixed(2)}</div>
              <div className="text-[12px] text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3" /> {kpis.pedidosCompletados} pedidos completados
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div onClick={() => toast.info(`Pedidos Activos: ${kpis.pedidosActivos}`)} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Pedidos Activos</div>
              <div className="text-2xl font-bold text-gray-900">{kpis.pedidosActivos}</div>
              <div className="text-[12px] text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3" /> {totalPedidos} totales
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div onClick={() => toast.info(`Tasa de Devolución: ${kpis.tasaDevolucion.toFixed(2)}%`)} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Tasa de Devolución</div>
              <div className="text-2xl font-bold text-gray-900">{kpis.tasaDevolucion.toFixed(2)}%</div>
              <div className="text-[12px] text-red-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowDownRight className="w-3 h-3" /> {kpis.ticketPromedio.toFixed(2)} ticket prom.
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div onClick={() => toast.info(`Vendedores Activos: ${kpis.vendedoresActivos}`)} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Vendedores Activos</div>
              <div className="text-2xl font-bold text-gray-900">{kpis.vendedoresActivos}</div>
              <div className="text-[12px] text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3" /> {vendedores.length} registrados
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 m-0">Ventas</h3>
            <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-200">
              {["7D", "30D", "YTD"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-all",
                    dateRange === range
                      ? "bg-white shadow-sm border border-gray-200 text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[240px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.length > 0 ? chartData : [{ name: "Sin datos", value: 0 }]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ventas']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-gray-900 m-0 mb-4">Top Vendedores</h3>
          <div className="flex flex-col gap-4 flex-1">
            {topVendedores.map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs shrink-0">
                  {v.init}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{v.name}</div>
                  <div className="text-xs text-gray-500 font-mono">${v.gmv.toLocaleString()}</div>
                </div>
                <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">
                  #{i + 1}
                </div>
              </div>
            ))}
            {topVendedores.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-8">Sin vendedores</div>
            )}
          </div>
          <button
            onClick={() => toast.success("Cargando todos los vendedores...")}
            className="w-full mt-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors border border-transparent"
          >
            Ver Todos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
           <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="m-0 text-base font-bold text-gray-900">Últimos Pedidos</h3>
              <button onClick={() => toast.success("Cargando todos los pedidos...")} className="text-xs font-medium text-primary hover:text-primary-dark">Ver Todos</button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead>
                 <tr>
                   <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">#Pedido</th>
                   <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">Cliente</th>
                   <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 text-right">Total</th>
                   <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200 text-center">Estado</th>
                 </tr>
               </thead>
               <tbody>
                 {recentPedidos.map((order) => {
                   const total = getPedidoTotal(order.id);
                   const statusColors: Record<string, string> = {
                     Pendiente: "bg-yellow-100 text-yellow-700",
                     "En Preparación": "bg-blue-100 text-blue-700",
                     Empacado: "bg-indigo-100 text-indigo-700",
                     Enviado: "bg-green-100 text-green-700",
                     Entregado: "bg-green-100 text-green-700",
                     Cancelado: "bg-red-100 text-red-700",
                   };
                   return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-[13px] font-mono text-primary font-medium border-b border-gray-100">{order.id}</td>
                      <td className="px-5 py-3 text-gray-900 border-b border-gray-100">{order.client}</td>
                      <td className="px-5 py-3 text-right font-mono text-gray-600 border-b border-gray-100">${total.toFixed(2)}</td>
                      <td className="px-5 py-3 text-center border-b border-gray-100">
                        <span className={`px-2 py-1 rounded text-[11px] font-medium uppercase ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                   );
                 })}
                 {recentPedidos.length === 0 && (
                   <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-500 text-sm">Sin pedidos recientes</td></tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
           <h3 className="m-0 text-base font-bold text-gray-900 mb-5">Actividad Reciente</h3>
           <div className="flex flex-col gap-4">
              <div className="flex gap-3 relative">
                 <div className="absolute left-1.5 top-5 bottom-[-20px] w-px bg-gray-200"></div>
                 <div className="w-3 h-3 rounded-full bg-primary mt-1.5 relative z-10 box-content border-2 border-white"></div>
                 <div>
                   <div className="text-sm font-medium text-gray-900">Nuevo Pedido <span className="font-mono text-primary">#DP-9021</span></div>
                   <div className="text-xs text-gray-500">Hace 2 minutos &bull; Bogotá</div>
                 </div>
              </div>
              <div className="flex gap-3 relative">
                 <div className="absolute left-1.5 top-5 bottom-[-20px] w-px bg-gray-200"></div>
                 <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 relative z-10 box-content border-2 border-white"></div>
                 <div>
                   <div className="text-sm font-medium text-gray-900">Stock Crítico: iPhone 13 Pro</div>
                   <div className="text-xs text-red-600">Quedan 3 unidades</div>
                 </div>
              </div>
              <div className="flex gap-3 relative">
                 <div className="w-3 h-3 rounded-full bg-gray-300 mt-1.5 relative z-10 box-content border-2 border-white"></div>
                 <div>
                   <div className="text-sm font-medium text-gray-900">Vendedor Aprobado</div>
                   <div className="text-xs text-gray-500">Tienda Pro Gadgets</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
