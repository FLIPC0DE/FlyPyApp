import { useState } from "react";
import type { ReactNode } from "react";
import { redireccionContexto } from "./redireccionContexto";

export const RedireccionProvider = ({ children }: { children: ReactNode }) => {
  const [destino, setDestino] = useState<string | null>(null);

  return (
    <redireccionContexto.Provider value={{ destino, setDestino }}>
      {children}
    </redireccionContexto.Provider>
  );
};
