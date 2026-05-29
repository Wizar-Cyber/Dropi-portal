import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, MoreVertical, Edit2, X, Mail } from "lucide-react";
import { cn } from "../lib/utils";
import { can } from "../store";
import { useAppStore } from "../store";
import { toast } from "sonner";

interface InviteForm {
  email: string;
  role: "Administrador" | "Editor" | "Visualizador";
}

export default function Team() {
  const { equipo, authUser, addMiembro, updateMiembro, deleteMiembro, toggleMiembroStatus } = useAppStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteForm>();

  const isAdmin = authUser?.role === "Administrador";
  const canEdit = authUser ? can(authUser.role, "editar") : false;

  const onSubmitInvite = (data: InviteForm) => {
    const name = data.email.split("@")[0].replace(/[._]/g, " ");
    const title = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    addMiembro({ name: title, title: "Miembro del Equipo", role: data.role, active: true, email: data.email });
    toast.success(`${title} añadido al equipo`);
    setIsInviteOpen(false);
    reset();
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Invitar al Equipo</h3>
              <button onClick={() => { setIsInviteOpen(false); reset(); }} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitInvite)}>
              <div className="p-6 flex flex-col gap-5">
                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Correo Electrónico <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input type="email" {...register("email", { required: "El correo es obligatorio" })} placeholder="medico@clinica.com" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                   </div>
                   {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                 </div>

                 <div className="flex flex-col gap-1.5 text-left">
                   <label className="text-sm font-bold text-gray-700">Rol</label>
                   <select {...register("role")} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                     <option value="Visualizador">Visualizador</option>
                     <option value="Editor">Editor</option>
                     <option value="Administrador">Administrador</option>
                   </select>
                   <p className="text-xs text-gray-500 mt-1">El nivel de acceso del nuevo integrante al sistema.</p>
                 </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button type="button" onClick={() => { setIsInviteOpen(false); reset(); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                   Cancelar
                 </button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                   Enviar Invitación
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold m-0 leading-none">Gestión del Equipo y Roles</h2>
          <span className="text-gray-400 leading-none">/</span>
          <span className="text-gray-500 text-sm leading-none">Administra el acceso de tu personal</span>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 font-medium rounded-md text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="size-4" />
            Invitar Miembro
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {equipo.map((member) => (
          <div
            key={member.id}
            className="bg-surface border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full"
          >
            {isAdmin && (
              <button
                onClick={() => {
                  deleteMiembro(member.id);
                  toast.success(`${member.name} eliminado del equipo`);
                }}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="size-4" />
              </button>
            )}

            <div className="flex flex-col items-center text-center mt-2 mb-4">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="size-16 rounded-full border-2 border-white shadow-sm mb-3"
              />
              <h3 className="font-semibold text-gray-900 leading-tight">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{member.title}</p>
            </div>

            <div className="flex justify-center mb-6">
              <span className={cn(
                "px-2 py-1 rounded text-[11px] font-medium uppercase",
                member.role === "Administrador" ? "bg-purple-100 text-purple-700" :
                member.role === "Editor" ? "bg-blue-100 text-blue-700" :
                "bg-gray-100 text-gray-700"
              )}>
                {member.role}
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleMiembroStatus(member.id);
                    toast.success(`${member.name} ahora está ${!member.active ? 'Activo' : 'Inactivo'}`);
                  }}
                  className={cn(
                    "relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    member.active ? "bg-green-500" : "bg-gray-300"
                  )}
                  role="switch"
                  aria-checked={member.active}
                >
                  <span className="sr-only">Toggle state</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      member.active ? "translate-x-3" : "translate-x-0"
                    )}
                  />
                </button>
                <span className="text-xs font-medium text-gray-500">
                  {member.active ? "Activo" : "Inactivo"}
                </span>
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    const newRole = member.role === "Administrador" ? "Editor" : member.role === "Editor" ? "Visualizador" : "Administrador";
                    updateMiembro(member.id, { role: newRole });
                    toast.success(`${member.name} ahora es ${newRole}`);
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors px-2 py-1 -mr-2 rounded-md hover:bg-primary-light"
                >
                  <Edit2 className="size-3.5" />
                  Rol
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
