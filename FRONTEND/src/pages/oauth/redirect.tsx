import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { AutenticacionContexto } from "@/context/autenticacionContexto";
import type { DecodedToken } from "@/context/autenticacionContexto";
import { useRedireccion } from "@/context/redireccionContexto";

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

      sessionStorage.setItem("showWelcomeToast", "true");
      // navigate(destino ?? "/seleccionar-rol");
      if (decoded.rol_global) {
        navigate(destino ?? "/panel-de-control");
      } else {
        navigate("/seleccionar-rol");
      }
    } else {
      navigate("/login");
    }
  }, [destino, location.search, navigate, setUser]);

  return (
    <>
      <p className="p-6">Procesando inicio de sesión...</p>
    </>
  );
}
