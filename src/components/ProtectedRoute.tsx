import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore, type RolMiembro } from "../store";

interface ProtectedRouteProps {
  requiredRole?: RolMiembro;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const authUser = useAppStore((s) => s.authUser);
  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && requiredRole === "Administrador" && authUser.role !== "Administrador") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
