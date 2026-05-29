import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Kanban, ShoppingCart, Users, Truck, BarChart3, Settings, Bell, Search, ChevronLeft, ChevronRight, Shield, Briefcase } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAppStore } from "../store";

export default function Layout() {
  const navigate = useNavigate();
  const authUser = useAppStore((s) => s.authUser);
  const logout = useAppStore((s) => s.logout);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const [notifications, setNotifications] = useState([
     { id: 1, title: "Nuevo Pedido #DP-9025", time: "hace 10 min", unread: true, desc: "Recibido nuevo pedido para Fernando Ruiz." },
     { id: 2, title: "Stock Crítico: SKU-189", time: "hace 45 min", unread: true, desc: "Quedan menos de 5 unidades en inventario." },
     { id: 3, title: "Vendedor 'Tech Store' activo", time: "hace 2 horas", unread: false, desc: "Su cuenta ha sido aprobada exitosamente." }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({...n, unread: false})));
    toast.success("Todas las notificaciones marcadas como leídas");
  };

  const navItems = [
    { name: "Dashboard", to: "/", icon: LayoutDashboard },
    { name: "Inventario", to: "/inventario", icon: Package },
    { name: "Logística Kanban", to: "/kanban", icon: Kanban },
    { name: "Pedidos", to: "/pedidos", icon: ShoppingCart },
    { name: "Vendedores", to: "/vendedores", icon: Users },
    { name: "Proveedores", to: "/proveedores", icon: Truck },
    { name: "Equipo", to: "/team", icon: Shield },
    { name: "Servicios", to: "/services", icon: Briefcase },
    { name: "Reportes", to: "/reportes", icon: BarChart3 },
    { name: "Configuración", to: "/configuracion", icon: Settings },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-canvas text-gray-900 overflow-hidden font-sans">
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="bg-sidebar text-white flex flex-col pt-6 pb-6 shrink-0 relative z-20 shadow-xl"
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-8 bg-surface text-gray-500 hover:text-primary p-1.5 rounded-full border border-gray-200 shadow-md z-30 transition-transform hover:scale-110"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className={cn("px-6 pb-8 flex items-center gap-2.5", !isSidebarOpen && "justify-center px-0")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <AnimatePresence initial={false}>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="font-bold text-[22px] tracking-tight whitespace-nowrap overflow-hidden"
              >
                Dropy
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 py-3 text-sm transition-all group relative",
                  isSidebarOpen ? "px-6" : "px-0 justify-center",
                  isActive
                    ? "bg-primary/10 text-primary font-bold border-l-4 border-primary"
                    : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                  <AnimatePresence initial={false}>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-900 border border-gray-800 text-white text-xs font-medium rounded shadow-xl opacity-0 translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={cn("flex flex-col gap-4 mt-auto", isSidebarOpen ? "px-6" : "px-0 items-center")}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors border-l-4 border-transparent group",
              isSidebarOpen ? "px-6 mx-[-24px] text-left w-[calc(100%+48px)]" : "justify-center w-full relative"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 group-hover:scale-110 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <AnimatePresence initial={false}>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Cerrar Sesión
                </motion.span>
              )}
            </AnimatePresence>
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-900 border border-gray-800 text-white text-xs font-medium rounded shadow-xl opacity-0 translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all">
                Cerrar Sesión
              </div>
            )}
          </button>
          <AnimatePresence initial={false}>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 0.5, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[11px] pb-2 whitespace-nowrap overflow-hidden"
              >
                v2.4.0 SaaS Admin
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold m-0 text-gray-900 tracking-tight">Portal Administrativo</h2>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 text-sm font-medium">Vista Global</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-64 relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar (IDs, SKU, Vendedor)..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    ></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col origin-top-right ring-1 ring-black ring-opacity-5"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                        <h3 className="font-bold text-sm text-gray-900 m-0">Notificaciones</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">Marcar leídas</button>
                        )}
                      </div>
                      <div className="flex-1 overflow-y-auto max-h-[300px]">
                        {notifications.length > 0 ? notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              setNotifications(notifications.map(n => n.id === notif.id ? {...n, unread: false} : n));
                            }}
                            className={cn(
                              "p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors group",
                              notif.unread ? "bg-blue-50/40" : "opacity-80"
                            )}>
                             <div className="flex items-start justify-between mb-1">
                                <span className={cn("text-sm transition-colors", notif.unread ? "font-bold text-gray-900 group-hover:text-primary" : "font-medium text-gray-700")}>{notif.title}</span>
                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2 shrink-0">{notif.time}</span>
                             </div>
                             <p className="text-xs text-gray-500 m-0 leading-snug line-clamp-2">{notif.desc}</p>
                          </div>
                        )) : (
                          <div className="p-8 text-center text-sm text-gray-500">
                            No tienes nuevas notificaciones
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-50 text-center bg-gray-50/50">
                        <button className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">Ver todas las notificaciones</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-900 leading-tight">{authUser?.name || "Usuario"}</div>
                <div className="text-[12px] text-gray-500 font-medium capitalize">{authUser?.role?.toLowerCase() || "Sin rol"}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {authUser?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
