import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import { toast } from "sonner";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const registerUser = useAppStore((s) => s.register);
  const navigate = useNavigate();

  const onSubmit = (data: RegisterForm) => {
    registerUser(data.name, data.email, data.password);
    toast.success("Registro exitoso");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Crear Cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Regístrate en el portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
            <input
              type="text"
              {...register("name", { required: "El nombre es obligatorio" })}
              placeholder="Tu nombre"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              {...register("email", { required: "El correo es obligatorio" })}
              placeholder="correo@ejemplo.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (val) => val === watch("password") || "Las contraseñas no coinciden",
              })}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-md"
          >
            Crear Cuenta
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
