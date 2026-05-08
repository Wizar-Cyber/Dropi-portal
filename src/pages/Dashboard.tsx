import { ArrowUpRight, ArrowDownRight, Package, DollarSign, Users, AlertCircle, ShoppingCart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "../lib/utils";

const mockChartData = [
  { name: "Mar 1", value: 4000 },
  { name: "Mar 2", value: 6000 },
  { name: "Mar 3", value: 5500 },
  { name: "Mar 4", value: 8500 },
  { name: "Mar 5", value: 4500 },
  { name: "Mar 6", value: 7000 },
  { name: "Mar 7", value: 9000 },
  { name: "Mar 8", value: 10000 },
  { name: "Mar 9", value: 6500 },
  { name: "Mar 10", value: 5000 },
  { name: "Mar 11", value: 7500 },
  { name: "Mar 12", value: 4000 },
  { name: "Mar 13", value: 8000 },
  { name: "Mar 14", value: 5500 },
  { name: "Mar 15", value: 6000 },
];

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('30D');

  const handleDateChange = (range: string) => {
    setDateRange(range);
    toast.info(`Cargando datos para los últimos ${range}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => toast.info("Mostrando detalles de Ingresos Totales")} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Ingresos Totales</div>
              <div className="text-2xl font-bold text-gray-900">$42,850.00</div>
              <div className="text-[12px] text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3" /> 12.5% vs mes anterior
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div onClick={() => toast.info("Mostrando detalles de Pedidos Activos")} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Pedidos Activos</div>
              <div className="text-2xl font-bold text-gray-900">1,284</div>
              <div className="text-[12px] text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3" /> 4.2% hoy
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div onClick={() => toast.info("Mostrando detalles de Tasa de Devolución")} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Tasa de Devolución</div>
              <div className="text-2xl font-bold text-gray-900">1.84%</div>
              <div className="text-[12px] text-red-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowDownRight className="w-3 h-3" /> 0.3% mejora
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div onClick={() => toast.info("Mostrando detalles de Vendedores Activos")} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transform transition-transform hover:scale-105 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest mb-1">Vendedores Activos</div>
              <div className="text-2xl font-bold text-gray-900">342</div>
              <div className="text-[12px] text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3" /> +12 esta semana
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 m-0">Ventas</h3>
            <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-200">
              {['7D', '30D', 'YTD'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleDateChange(range)}
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
                <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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

        {/* Top Vendedores */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-gray-900 m-0 mb-4">Top Vendedores</h3>
          <div className="flex flex-col gap-4 flex-1">
            {[ 
              { name: "Juan Pérez", sales: "$12,450", rank: 1, init: "JP" },
              { name: "Tienda Tech", sales: "$9,800", rank: 2, init: "TT" },
              { name: "María Gómez", sales: "$7,340", rank: 3, init: "MG" },
              { name: "DropKing", sales: "$5,120", rank: 4, init: "DK" },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs shrink-0">
                  {v.init}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{v.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{v.sales}</div>
                </div>
                <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">
                  #{v.rank}
                </div>
              </div>
            ))}
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
        {/* Tabla Últimos Pedidos */}
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
                 {[
                   { id: "DP-9021", client: "Andrés Silva", total: "$120.50", status: "Enviado", statusColor: "bg-green-100 text-green-700" },
                   { id: "DP-9020", client: "Luisa Méndez", total: "$45.00", status: "Pendiente", statusColor: "bg-yellow-100 text-yellow-700" },
                   { id: "DP-9019", client: "Carlos Vives", total: "$89.90", status: "Empacado", statusColor: "bg-blue-100 text-blue-700" },
                   { id: "DP-9018", client: "Ana Rivas", total: "$199.00", status: "Cancelado", statusColor: "bg-red-100 text-red-700" },
                  ].map((order, i) => (
                   <tr key={i} className="hover:bg-gray-50">
                     <td className="px-5 py-3 text-[13px] font-mono text-primary font-medium border-b border-gray-100">{order.id}</td>
                     <td className="px-5 py-3 text-gray-900 border-b border-gray-100">{order.client}</td>
                     <td className="px-5 py-3 text-right font-mono text-gray-600 border-b border-gray-100">{order.total}</td>
                     <td className="px-5 py-3 text-center border-b border-gray-100">
                       <span className={`px-2 py-1 rounded text-[11px] font-medium uppercase ${order.statusColor}`}>
                         {order.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
           <h3 className="m-0 text-base font-bold text-gray-900 mb-5">Actividad Reciente</h3>
           <div className="flex flex-col gap-4">
              <div className="flex gap-3 relative">
                 <div className="absolute left-1.5 top-5 bottom-[-20px] w-px bg-gray-200"></div>
                 <div className="w-3 h-3 rounded-full bg-primary mt-1.5 relative z-10 box-content border-2 border-white"></div>
                 <div>
                   <div className="text-sm font-medium text-gray-900">Nuevo Pedido <span className="font-mono text-primary">#DP-9021</span></div>
                   <div className="text-xs text-gray-500">Hace 2 minutos • Bogotá</div>
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
