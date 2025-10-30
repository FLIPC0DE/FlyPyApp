import { createContext, useState, useContext } from "react";

type RedireccionContextoType = {
  destino: string | null;
  setDestino: (ruta: string | null) => void;
};

export const RedireccionContexto = createContext<RedireccionContextoType | null>(null);

export const RedireccionProvider = ({ children }: { children: React.ReactNode }) => {
  const [destino, setDestino] = useState<string | null>(null);

  return (
    <RedireccionContexto.Provider value={{ destino, setDestino }}>
      {children}
    </RedireccionContexto.Provider>
  );
};

export const useRedireccion = () => useContext(RedireccionContexto)!;
