// context/autenticacionProvider.tsx
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { addToast } from "@heroui/react";
import { AutenticacionContexto } from "./autenticacionContexto";
import type { DecodedToken } from "./autenticacionContexto";

export const AutenticacionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        console.log("🔍 Token decodificado:", decoded);
        setUser(decoded);
        setToken(storedToken);

        const showToast = sessionStorage.getItem("showWelcomeToast");
        if (showToast === "true") {
          const nombre = decoded.nombre?.trim() || "usuario";
          addToast({
            title: "Inicio de sesión exitoso ✅",
            description: `Bienvenido de nuevo, ${nombre}`,
            color: "success",
          });
          sessionStorage.removeItem("showWelcomeToast");
        }
      } catch (error) {
        console.error("❌ Error al decodificar el token:", error);
      }
    }
  }, []);

  const logout = () => {
    const nombre = user?.nombre?.trim() || "usuario";
    const rol = user?.rol_global?.trim() || "sin rol";

    console.log("👋 Cerrando sesión de:", { nombre, rol });

    const mensaje =
      rol === "ESTUDIANTE"
        ? `Tu esfuerzo se nota cada día más, ${nombre}. ¡Sigue así!`
        : `Gracias por tu trabajo como ${rol}, ${nombre}.`;

    addToast({
      title: "Sesión cerrada 👋",
      description: mensaje,
      color: "warning",
    });

    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AutenticacionContexto.Provider value={{ user, setUser, logout, token }}>
      {children}
    </AutenticacionContexto.Provider>
  );
};
