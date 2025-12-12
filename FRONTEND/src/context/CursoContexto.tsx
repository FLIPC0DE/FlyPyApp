import { createContext, useContext, useState, ReactNode } from "react";

// 1️⃣ Definir los tipos del contexto
type CursoContextType = {
  topicoSeleccionado: number | null;
  setTopicoSeleccionado: (id: number | null) => void;
  moduloSeleccionado: any;
  setModuloSeleccionado: (modulo: any) => void;
};

// 2️⃣ Crear el contexto con tipo explícito
const CursoContext = createContext<CursoContextType | undefined>(undefined);

// 3️⃣ Provider
export function CursoProvider({ children }: { children: ReactNode }) {
  const [topicoSeleccionado, setTopicoSeleccionado] = useState<number | null>(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState<any>(null);

  return (
    <CursoContext.Provider
      value={{
        topicoSeleccionado,
        setTopicoSeleccionado,
        moduloSeleccionado,
        setModuloSeleccionado,
      }}
    >
      {children}
    </CursoContext.Provider>
  );
}

// 4️⃣ Hook seguro para consumir el contexto
export function useCurso() {
  const context = useContext(CursoContext);
  if (!context) {
    throw new Error("useCurso debe usarse dentro de un CursoProvider");
  }
  return context;
}
