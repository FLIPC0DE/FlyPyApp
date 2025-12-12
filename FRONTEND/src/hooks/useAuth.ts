import { useContext } from "react";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Facilita el uso en componentes sin importar useContext directamente
 */
export function useAuth() {
  const context = useContext(AutenticacionContexto);
  
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}

