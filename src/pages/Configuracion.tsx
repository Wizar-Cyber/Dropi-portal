import { useState } from "react";
import { Save, Building2, Globe, CreditCard, Users, Search, MoreHorizontal, Edit2, Plus, ArrowRight, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    setIsSaving(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Guardando cambios...',
        success: 'Configuración actualizada correctamente',
        error: 'Error al guardar los cambios',
        finally: () => setIsSaving(false)
      }
    );
  };

  const handleGenerateToken = () => {
    toast.success("Nuevo token generado y copiado al portapapeles");
  };

  const handleCopy = (prefix: string) => {
    toast.info(`Token ${prefix} copiado al portapapeles`);
  };

  const handleRevoke = () => {
    toast.error("Token revocado permanentemente");
  };

  const TABS = [
    { id: "profile", label: "Perfil de la Empresa", icon: Building2 },
    { id: "system", label: "Ajustes del Sistema", icon: Globe },
    { id: "integrations", label: "Integraciones (API)", icon: CreditCard },
    { id: "users", label: "Gestión de Usuarios", icon: Users },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-88px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Configuración</h1>
          <p className="text-sm text-gray-500 mt-1">Ajustes globales y administración del portal.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
           >
             <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} /> 
             {isSaving ? 'Guardando...' : 'Guardar Cambios'}
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Nav Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0 overflow-y-auto">
          {TABS.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                 activeTab === item.id 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
               }`}
             >
               <item.icon className="w-5 h-5" />
               {item.label}
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto w-full relative">
           
           {/* Section 1: Perfil de Empresa */}
           {activeTab === "profile" && (
             <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h2 className="text-lg font-bold text-gray-900 mb-6 font-sans">Perfil de la Empresa</h2>
               
               <div className="flex items-start gap-8 mb-8">
                  <div className="flex flex-col gap-3 items-center">
                     <div 
                       onClick={() => toast.info("Abre el selector de archivos locales...")}
                       className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20 flex items-center justify-center font-bold text-white text-sm overflow-hidden relative group cursor-pointer transition-transform hover:scale-105"
                     >
                        <div className="flex flex-col items-center">
                           <span className="text-2xl">D</span>
                           <span className="text-[10px] tracking-widest mt-1 opacity-80">DROPY</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 text-white flex-col items-center justify-center hidden group-hover:flex backdrop-blur-sm transition-all duration-200">
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[10px]">Cambiar</span>
                        </div>
                     </div>
                     <button onClick={() => toast.info("Abre el selector de archivos locales...")} className="text-xs font-bold text-primary hover:underline">Cambiar Logo</button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <div>
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre Comercial</label>
                       <input type="text" defaultValue="Dropy Global S.A.S" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-2">NIT / ID Físcal</label>
                       <input type="text" defaultValue="901.234.567-8" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono" />
                     </div>
                     <div className="sm:col-span-2">
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Correo de Contacto Soporte</label>
                       <input type="email" defaultValue="soporte@dropy.com" className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                     </div>
                  </div>
               </div>
             </div>
           )}

           {/* Section 2: Ajustes del Sistema */}
           {activeTab === "system" && (
             <div className="p-8 bg-gray-50/50 min-h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h2 className="text-lg font-bold text-gray-900 mb-6 font-sans">Ajustes del Sistema</h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Moneda Principal</label>
                    <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-medium text-gray-900">
                      <option value="COP">COP - Peso Colombiano</option>
                      <option value="USD">USD - Dólar Estadounidense</option>
                      <option value="MXN">MXN - Peso Mexicano</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Idioma</label>
                    <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-medium text-gray-900">
                      <option value="es">Español (Latam)</option>
                      <option value="en">Inglés (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Zona Horaria</label>
                    <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-medium text-gray-900">
                      <option value="America/Bogota">(UTC-05:00) Bogotá, Lima, Quito</option>
                      <option value="America/Mexico_City">(UTC-06:00) Ciudad de México</option>
                    </select>
                  </div>
               </div>

               <div className="border-t border-gray-200 pt-8 mt-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Preferencias Adicionales</h3>
                  <div className="flex flex-col gap-4">
                     <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <div>
                           <div className="text-sm font-bold text-gray-900">Notificaciones de Escritorio</div>
                           <div className="text-xs text-gray-500 mt-0.5">Recibir alertas de nuevos pedidos y chat en tiempo real.</div>
                        </div>
                        <button
                          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            notificationsEnabled ? "bg-green-500" : "bg-gray-300"
                          )}
                        >
                          <span className={cn(
                              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              notificationsEnabled ? "translate-x-4" : "translate-x-0"
                            )} 
                          />
                        </button>
                     </label>
                     <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <div>
                           <div className="text-sm font-bold text-gray-900">Asignación Automática Dropy</div>
                           <div className="text-xs text-gray-500 mt-0.5">Asignar automáticamente pedidos entrantes a tus vendedores activos.</div>
                        </div>
                        <button
                          onClick={() => toast.success("Preferencias actualizadas")}
                          className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none"
                        >
                          <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
                        </button>
                     </label>
                  </div>
               </div>

             </div>
           )}

           {/* Section 3: Integraciones */}
           {activeTab === "integrations" && (
             <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 m-0 font-sans">Integraciones & API Keys</h2>
                  <button onClick={handleGenerateToken} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                     <Plus className="w-3.5 h-3.5" /> Generar Nuevo Token
                  </button>
               </div>
               
               <div className="flex flex-col gap-4">
                  {[
                    { name: "Shopify Conector V2", prefix: "sk_live_51M...", date: "Creado 14 Oct 2023" },
                    { name: "Sincronización WooCommerce", prefix: "sk_live_89N...", date: "Creado 02 Sep 2023" }
                  ].map((token, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                       <div>
                         <div className="font-bold text-gray-900 text-sm">{token.name}</div>
                         <div className="text-xs text-gray-500 mt-0.5">{token.date}</div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="bg-white border border-gray-200 rounded px-3 py-1 font-mono text-sm text-gray-600 flex items-center gap-2">
                            •••••••••••••••••••• {token.prefix.slice(-4)}
                            <button onClick={() => handleCopy(token.prefix)} className="text-xs font-bold text-primary hover:underline ml-2">Copiar</button>
                          </div>
                          <button onClick={handleRevoke} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors text-sm font-medium">Revocar</button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
           )}

           {/* Section 4: Users Management Preview */}
           {activeTab === "users" && (
             <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 m-0 font-sans">Gestión de Usuarios</h2>
                  <button 
                     onClick={() => toast.success("Abriendo modal para invitar usuario...")}
                    className="flex items-center gap-2 text-sm font-medium text-white bg-gray-900 px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Invitar Usuario
                  </button>
               </div>

               <table className="w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden hidden sm:table">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-200">Usuario</th>
                     <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-200">Rol</th>
                     <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-200 text-center">Estado</th>
                     <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-200 text-right">Acciones</th>
                   </tr>
                 </thead>
                 <tbody>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">CM</div>
                           <div>
                             <div className="font-bold text-sm text-gray-900">Carlos Mendoza</div>
                             <div className="text-xs text-gray-500">carlos.m@dropy.com</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide">Admin Global</span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-center">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide">Activo</span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-right">
                         <button onClick={() => toast.info("Editando permisos de Carlos Mendoza...")} className="p-1.5 text-gray-400 hover:text-primary rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 font-bold text-xs flex items-center justify-center">LM</div>
                           <div>
                             <div className="font-bold text-sm text-gray-900">Laura Martínez</div>
                             <div className="text-xs text-gray-500">laura.m@dropy.com</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide">Operador</span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-center">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide">Activo</span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-right">
                         <button onClick={() => toast.info("Editando permisos de Laura Martínez...")} className="p-1.5 text-gray-400 hover:text-primary rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                 </tbody>
               </table>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
