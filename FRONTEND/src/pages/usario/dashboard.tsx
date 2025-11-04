import { useContext, useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { useNavigate } from "react-router-dom";
import { AutenticacionContexto } from "@/context/autenticacionContexto";
import { apiRoutes } from "@/lib/api";

interface DashboardContenido {
  mensaje: string;
  acciones: string[];
}

export default function DashboardPage() {
  const { user } = useContext(AutenticacionContexto)!;
  const [contenido, setContenido] = useState<DashboardContenido | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar contenido del dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user?.rol_global) return;

    fetch(apiRoutes.usuarios.dashboard, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setContenido(data.contenido);
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [user, navigate]);

  // Pantalla de redirección si no tiene rol
  if (!user?.rol_global) {
    return (
      <section className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500 text-sm">
          Redirigiendo a selección de rol...
        </p>
      </section>
    );
  }

  // Pantalla de carga mientras se obtiene el contenido
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500 text-sm">Cargando dashboard...</p>
      </section>
    );
  }

  // Pantalla de carga mientras se obtiene el contenido
  if (!contenido) {
    return (
      <section className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500 text-sm">Cargando dashboard...</p>
      </section>
    );
  }

  // Render principal del dashboard
  return (
    <section className="flex flex-col gap-4 py-8 md:py-10">
      <h1 className={title({ color: "primary" })}>{contenido.mensaje}</h1>

      <h2 className="text-default-500 text-sm">
        Rol actual: <span className="font-semibold">{user.rol_global}</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {contenido.acciones.map((accion: string, index: number) => (
          <Card key={index}>
            <CardBody>
              <p className="text-lg font-semibold text-default-700">
                {accion}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
