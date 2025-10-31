import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import type { DecodedToken } from "@/context/AutenticacionContexto";
import { addToast, ToastProvider } from "@heroui/react";
import { useRedireccion } from "@/context/redireccion.contexto";

export default function OAuthRedirectPage() {
  const { setUser } = useContext(AutenticacionContexto)!;
  const navigate = useNavigate();
  const location = useLocation();
  const { destino } = useRedireccion();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);

      addToast({
        title: "Inicio de sesión exitoso ✅",
        description: "Bienvenido de nuevo",
        color: "success",
      });

      sessionStorage.setItem("showWelcomeToast", "true");
      // navigate(destino ?? "/seleccionar-rol");
      if (decoded.rol_global) {
        navigate(destino ?? "/dashboard");
      } else {
        navigate("/seleccionar-rol");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <ToastProvider placement="top-center" toastOffset={60} />
      <p className="p-6">Procesando inicio de sesión...</p>
    </>
  );
}
