import { useState } from "react";
import { Plus, MoreVertical, Edit2, X, Mail } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

type Role = "Administrador" | "Editor" | "Visualizador";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: Role;
  active: boolean;
  avatarUrl: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Roberto Mendoza",
    title: "Cardiólogo Principal",
    role: "Administrador",
    active: true,
    avatarUrl: "https://ui-avatars.com/api/?name=Roberto+Mendoza&background=2952B2&color=fff",
  },
  {
    id: "2",
    name: "Dra. Laura Jiménez",
    title: "Médico General",
    role: "Editor",
    active: true,
    avatarUrl: "https://ui-avatars.com/api/?name=Laura+Jimenez&background=2952B2&color=fff",
  },
  {
    id: "3",
    name: "Carlos Villagrán",
    title: "Fisioterapeuta",
    role: "Editor",
    active: false,
    avatarUrl: "https://ui-avatars.com/api/?name=Carlos+Villagran&background=2952B2&color=fff",
  },
  {
    id: "4",
    name: "Ana Sofía Peláez",
    title: "Recepcionista",
    role: "Visualizador",
    active: true,
    avatarUrl: "https://ui-avatars.com/api/?name=Ana+Sofia&background=2952B2&color=fff",
  },
];

const RoleBadge = ({ role }: { role: Role }) => {
  const styles = {
    Administrador: "bg-purple-100 text-purple-700",
    Editor: "bg-blue-100 text-blue-700",
    Visualizador: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-[11px] font-medium uppercase",
        styles[role]
      )}
    >
      {role}
    </span>
  );
};

export default function Team() {
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const toggleStatus = (id: string, name: string) => {
    setTeam((prev) =>
      prev.map((member) => {
        if (member.id === id) {
          const newStatus = !member.active;
          toast.success(`${name} ahora está ${newStatus ? 'Activo' : 'Inactivo'}`);
          return { ...member, active: newStatus };
        }
        return member;
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Modal Invitar Miembro */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col mt-[-50px]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 m-0">Invitar al Equipo</h3>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Correo Electrónico <span className="text-red-500">*</span></label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input type="email" placeholder="medico@clinica.com" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                 </div>
               </div>
               
               <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-sm font-bold text-gray-700">Rol</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                   <option>Visualizador</option>
                   <option>Editor</option>
                   <option>Administrador</option>
                 </select>
                 <p className="text-xs text-gray-500 mt-1">El nivel de acceso del nuevo integrante al sistema.</p>
               </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                 Cancelar
               </button>
               <button onClick={() => { setIsInviteOpen(false); toast.success("Invitación enviada correctamente"); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-sm">
                 Enviar Invitación
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold m-0 leading-none">Gestión del Equipo y Roles</h2>
          <span className="text-gray-400 leading-none">/</span>
          <span className="text-gray-500 text-sm leading-none">Administra el acceso de tu personal</span>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 font-medium rounded-md text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Invitar Miembro
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-surface border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full"
          >
            {/* Context menu mock */}
            <button 
              onClick={() => toast.info(`Opciones para ${member.name}`)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="size-4" />
            </button>

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
              <RoleBadge role={member.role} />
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(member.id, member.name)}
                  className={cn(
                    "relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    member.active ? "bg-success-text" : "bg-gray-300"
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

              <button 
                onClick={() => toast.info(`Editando permisos de ${member.name}`)}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors px-2 py-1 -mr-2 rounded-md hover:bg-primary-light"
              >
                <Edit2 className="size-3.5" />
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
