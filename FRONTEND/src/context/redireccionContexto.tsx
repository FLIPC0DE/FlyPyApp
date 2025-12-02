import { createContext, useContext } from "react";

export interface RedireccionContextoType {
  destino: string | null;
  setDestino: (ruta: string | null) => void;
}

export const redireccionContexto = createContext<RedireccionContextoType | null>(null);

export const useRedireccion = () => useContext(redireccionContexto)!;
