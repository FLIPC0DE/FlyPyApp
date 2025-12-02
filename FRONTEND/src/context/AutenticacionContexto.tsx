// context/autenticacionContexto.tsx
import { createContext } from "react";

export interface DecodedToken {
  userId: number;
  rol_global?: string;
  nombre?: string;
  avatar_url?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
}

export interface AutenticacionContextoType {
  user: DecodedToken | null;
  setUser: (user: DecodedToken | null) => void;
  logout: () => void;
  token: string | null; // 👈 nuevo
}

export const AutenticacionContexto = createContext<
  AutenticacionContextoType | undefined
>(undefined);
