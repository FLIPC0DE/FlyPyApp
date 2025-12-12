// src/context/AutenticacionContexto.tsx
// import type { ReactNode } from "react";
// import { createContext, useState, useEffect} from "react";
// import { jwtDecode } from "jwt-decode";

// export interface DecodedToken {
//   id_rol: number;
//   email: string;
//   nombre: string;
// }

// interface AutenticacionContextoType {
//   user: DecodedToken | null;
//   setUser: (user: DecodedToken | null) => void;
//   logout: () => void;
// }

// export const AutenticacionContexto = createContext<AutenticacionContextoType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<DecodedToken | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode<DecodedToken>(token);
//         setUser(decoded);
//       } catch (error) {
//         console.error("Error al decodificar el token:", error);
//       }
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AutenticacionContexto.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AutenticacionContexto.Provider>
//   );
// };

// src/context/AutenticacionContexto.tsx
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { addToast } from "@heroui/react";

export interface DecodedToken {
  userId: number;
  rol_global?: string;
  nombre?: string;
  avatar_url?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
}

interface AutenticacionContextoType {
  user: DecodedToken | null;
  setUser: (user: DecodedToken | null) => void;
  logout: () => void;
  isLoading: boolean;
  tieneRol: (rol: string) => boolean;
  tieneAlgunRol: (roles: string[]) => boolean;
}

export const AutenticacionContexto = createContext<
  AutenticacionContextoType | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const inicializarUsuario = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        
        // Validar expiración del token
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("⚠️ Token expirado");
          localStorage.removeItem("token");
          setUser(null);
          setIsLoading(false);
          return;
        }

        console.log("🔍 Token decodificado:", decoded);
        setUser(decoded);

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
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    inicializarUsuario();
  }, []);

  const logout = () => {
    const nombre = user?.nombre?.trim() || "usuario";
    const rol = user?.rol_global?.trim() || "sin rol";

    console.log("👋 Cerrando sesión de:", { nombre, rol });

    const mensaje = rol === "ESTUDIANTE"
      ? `Tu esfuerzo se nota cada día más, ${nombre}. ¡Sigue así!`
      : `Gracias por tu trabajo como ${rol}, ${nombre}.`;

    addToast({
      title: "Sesión cerrada 👋",
      description: mensaje,
      color: "warning",
    });

    localStorage.removeItem("token");
    setUser(null);
  };

  const tieneRol = (rol: string): boolean => {
    return user?.rol_global === rol;
  };

  const tieneAlgunRol = (roles: string[]): boolean => {
    if (!user?.rol_global) return false;
    return roles.includes(user.rol_global);
  };

  return (
    <AutenticacionContexto.Provider 
      value={{ 
        user, 
        setUser, 
        logout, 
        isLoading,
        tieneRol,
        tieneAlgunRol,
      }}
    >
      {children}
    </AutenticacionContexto.Provider>
  );
};
