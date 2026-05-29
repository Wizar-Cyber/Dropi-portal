import { useState } from "react";
import { Save, Building2, Globe, CreditCard, Users, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "../store";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const { empresa, updateEmpresa } = useAppStore();

  const [formData, setFormData] = useState({
    name: empresa.name,
    nit: empresa.nit,
    email: empresa.email,
    currency: empresa.currency,
    language: empresa.language,
    timezone: empresa.timezone,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateEmpresa(formData);
      toast.success("Configuracion actualizada correctamente");
      setIsSaving(false);
    }, 500);
  };

  const handleGenerateToken = () => {
    toast.success("Nuevo token generado y copiado al portapapeles");
  };

  const handleCopy = (prefix: string) => {
    toast.info("Token " + prefix + " copiado al portapapeles");
  };

  const handleRevoke = () => {
    toast.error("Token revocado permanentemente");
  };

  const TABS = [
    { id: "profile", label: "Perfil de la Empresa", icon: Building2 },
    { id: "system", label: "Ajustes del Sistema", icon: Globe },
    { id: "integrations", label: "Integraciones (API)", icon: CreditCard },
    { id: "users", label: "Gestion de Usuarios", icon: Users },
  ];

  const tabStyle = (tabId: string) =>
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left " +
    (activeTab === tabId ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100");

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-88px)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Configuracion</h1>
          <p className="text-sm text-gray-500 mt-1">Ajustes globales y administracion del portal.</p>
        </div>
        <div className="flex items-center gap-3">
           <button
             onClick={handleSave}
             disabled={isSaving}
             className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
           >
             <Save className={"w-4 h-4 " + (isSaving ? "animate-spin" : "")} />
             {isSaving ? "Guardando..." : "Guardar Cambios"}
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0 overflow-y-auto">
          {TABS.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={tabStyle(item.id)}
             >
               <item.icon className="w-5 h-5" />
               {item.label}
             </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto w-full relative">

           {activeTab === "profile" && (
             <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h2 className="text-lg font-bold text-gray-900 mb-6 font-sans">Perfil de la Empresa</h2>

               <div className="flex items-start gap-8 mb-8">
                  <div className="flex flex-col gap-3 items-center">
                     <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20 flex items-center justify-center font-bold text-white text-sm overflow-hidden relative group cursor-pointer transition-transform hover:scale-105">
                        <div className="flex flex-col items-center">
                           <span className="text-2xl">D</span>
                           <span className="text-[10px] tracking-widest mt-1 opacity-80">DROPY</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 text-white flex-col items-center justify-center hidden group-hover:flex backdrop-blur-sm transition-all">
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[10px]">Cambiar</span>
                        </div>
                     </div>
                     <button className="text-xs font-bold text-primary hover:underline">Cambiar Logo</button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <div>
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre Comercial</label>
                       <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-2">NIT / ID Fiscal</label>
                       <input type="text" value={formData.nit} onChange={(e) => setFormData({ ...formData, nit: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono" />
                     </div>
                     <div className="sm:col-span-2">
                       <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Correo de Contacto Soporte</label>
                       <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                     </div>
                  </div>
               </div>
             </div>
           )}

           {activeTab === "system" && (
             <div className="p-8 bg-gray-50/50 min-h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h2 className="text-lg font-bold text-gray-900 mb-6 font-sans">Ajustes del Sistema</h2>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Moneda Principal</label>
                    <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-medium text-gray-900">
                      <option value="COP">COP - Peso Colombiano</option>
                      <option value="USD">USD - Dolar Estadounidense</option>
                      <option value="MXN">MXN - Peso Mexicano</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Idioma</label>
                    <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-medium text-gray-900">
                      <option value="es">Espanol (Latam)</option>
                      <option value="en">Ingles (US)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Zona Horaria</label>
                    <select value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-medium text-gray-900">
                      <option value="America/Bogota">(UTC-05:00) Bogota, Lima, Quito</option>
                      <option value="America/Mexico_City">(UTC-06:00) Ciudad de Mexico</option>
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
                        <span className="text-xs text-gray-400">{empresa.notificationsEnabled ? "Activado" : "Desactivado"}</span>
                     </label>
                  </div>
               </div>
             </div>
           )}

           {activeTab === "integrations" && (
             <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 m-0 font-sans">Integraciones & API Keys</h2>
                  <button onClick={handleGenerateToken} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                     Generar Nuevo Token
                  </button>
               </div>

               <div className="flex flex-col gap-4">
                  {[
                    { name: "Shopify Conector V2", prefix: "sk_live_51M...", date: "Creado 14 Oct 2023" },
                    { name: "Sincronizacion WooCommerce", prefix: "sk_live_89N...", date: "Creado 02 Sep 2023" }
                  ].map((token, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                       <div>
                         <div className="font-bold text-gray-900 text-sm">{token.name}</div>
                         <div className="text-xs text-gray-500 mt-0.5">{token.date}</div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="bg-white border border-gray-200 rounded px-3 py-1 font-mono text-sm text-gray-600 flex items-center gap-2">
                            {token.prefix}
                            <button onClick={() => handleCopy(token.prefix)} className="text-xs font-bold text-primary hover:underline ml-2">Copiar</button>
                          </div>
                          <button onClick={handleRevoke} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors text-sm font-medium">Revocar</button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
           )}

           {activeTab === "users" && (
             <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 m-0 font-sans">Gestion de Usuarios</h2>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-200">Usuario</th>
                       <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-200">Rol</th>
                       <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase border-b border-gray-200 text-center">Estado</th>
                     </tr>
                   </thead>
                   <tbody>
                     {useAppStore.getState().equipo.map((member) => (
                       <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-3 border-b border-gray-100">
                           <div className="flex items-center gap-3">
                              <img src={member.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                              <div>
                                <div className="font-bold text-sm text-gray-900">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.email}</div>
                              </div>
                           </div>
                         </td>
                         <td className="px-4 py-3 border-b border-gray-100">
                           <span className={"px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide " + (member.role === "Administrador" ? "bg-purple-100 text-purple-700" : member.role === "Editor" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700")}>{member.role}</span>
                         </td>
                         <td className="px-4 py-3 border-b border-gray-100 text-center">
                           <span className={"px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide " + (member.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>{member.active ? "Activo" : "Inactivo"}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
