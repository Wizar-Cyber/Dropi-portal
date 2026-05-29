import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import { toast } from "sonner";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = (data: LoginForm) => {
    const success = login(data.email, data.password);
    if (success) {
      toast.success("Inicio de sesión exitoso");
      navigate("/");
    } else {
      toast.error("Credenciales inválidas");
    }
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
          <h1 className="text-2xl font-bold text-gray-900 m-0">Iniciar Sesión</h1>
          <p className="text-sm text-gray-500 mt-1">Accede al portal administrativo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              {...register("email", { required: "El correo es obligatorio" })}
              placeholder="admin@dropi.co"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: "La contraseña es obligatoria" })}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-md"
          >
            Acceder
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Registrarse
          </Link>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 font-medium mb-1">Demo:</p>
          <p className="text-xs text-gray-400 font-mono">admin@dropi.co / admin123</p>
        </div>
      </div>
    </div>
  );
}
