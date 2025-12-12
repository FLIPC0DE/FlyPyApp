import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import { useRedireccion } from "@/context/redireccion.contexto";
import DefaultLayout from "@/layouts/default";
import DashboardLayout from "@/layouts/DashboardLayout";
import Redireccionando from "@/pages/redireccionando";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/context/AutenticacionContexto";

type Props = {
  children: JSX.Element;
  rolesPermitidos?: string[];
  usarDashboardLayout?: boolean; // Nueva prop para usar layout con sidebar
};

/**
 * Middleware de protección de rutas
 * Valida token, expiración y roles antes de renderizar
 */
export default function RutaProtegida({ children, rolesPermitidos, usarDashboardLayout = false }: Props) {
  const { user, isLoading, tieneAlgunRol } = useContext(AutenticacionContexto)!;
  const { setDestino } = useRedireccion();
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setDestino(location.pathname);
      return;
    }

    // Validar expiración del token
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("⚠️ Token expirado, redirigiendo al login");
        localStorage.removeItem("token");
        setDestino(location.pathname);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("❌ Token inválido:", error);
      localStorage.removeItem("token");
      setDestino(location.pathname);
      navigate("/login", { replace: true });
    }
  }, [token, location.pathname, navigate, setDestino]);

  // Mostrar loading mientras se valida
  if (isLoading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center py-20">
          <p className="text-default-500">Cargando...</p>
        </section>
      </DefaultLayout>
    );
  }

  // Si no hay token, redirigir al login
  if (!token) {
    setDestino(location.pathname);
    return <Redireccionando destino={location.pathname} />;
  }

  // Si no hay usuario (token inválido), redirigir al login
  if (!user) {
    localStorage.removeItem("token");
    setDestino(location.pathname);
    return <Redireccionando destino={location.pathname} />;
  }

  // Validar roles si se especificaron
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    if (!tieneAlgunRol(rolesPermitidos)) {
      return (
        <DefaultLayout>
          <section className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-danger text-lg font-semibold">
              Acceso denegado
            </p>
            <p className="text-default-500 text-sm">
              Tu rol ({user.rol_global || "sin rol"}) no tiene permiso para acceder a esta sección.
            </p>
            <p className="text-default-400 text-xs mt-2">
              Roles permitidos: {rolesPermitidos.join(", ")}
            </p>
          </section>
        </DefaultLayout>
      );
    }
  }

  // Usar DashboardLayout si se especifica (para páginas que necesitan sidebar)
  if (usarDashboardLayout) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Layout por defecto para otras páginas
  return <DefaultLayout>{children}</DefaultLayout>;
}
