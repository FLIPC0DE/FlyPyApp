// src/context/AutenticacionContexto.tsx
import type { ReactNode } from "react";
import { createContext, useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id_rol: number;
  email: string;
  nombre: string;
}

interface AutenticacionContextoType {
  user: DecodedToken | null;
  setUser: (user: DecodedToken | null) => void;
  logout: () => void;
}

export const AutenticacionContexto = createContext<AutenticacionContextoType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AutenticacionContexto.Provider value={{ user, setUser, logout }}>
      {children}
    </AutenticacionContexto.Provider>
  );
};
