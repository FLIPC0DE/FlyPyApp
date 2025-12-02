import { AutenticacionContexto } from "@/context/autenticacionContexto";
import { useRedireccion } from "@/context/redireccionContexto";
import DefaultLayout from "@/layouts/default";
import Redireccionando from "@/pages/redireccionando";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  children: JSX.Element;
  rolesPermitidos?: string[];
}

export default function RutaProtegida({ children, rolesPermitidos }: Props) {
  const { user } = useContext(AutenticacionContexto)!;
  const { setDestino } = useRedireccion();
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setDestino(location.pathname);
    }
  }, [token, setDestino, location.pathname]);
  
  if (!token) {
    setDestino(location.pathname);
    return <Redireccionando destino={location.pathname} />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(user?.rol_global ?? "")) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-danger text-sm font-semibold">
            Acceso denegado: tu rol no tiene permiso para esta sección.
          </p>
        </section>
      </DefaultLayout>
    );
  }

  return <DefaultLayout>{children}</DefaultLayout>;
}
