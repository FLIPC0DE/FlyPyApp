// FRONTEND/src/pages/cursos/courses.tsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRoutes } from "@/lib/api";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Curso } from "@/types/curso";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import { AutenticacionContexto } from "@/context/autenticacionContexto";
import { Plus } from "lucide-react";

export default function CoursesPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AutenticacionContexto)!;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiRoutes.cursos.listar, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Error al obtener cursos");

        const data = await res.json();
        setCursos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-6 py-8 md:py-10">
        <div className="flex justify-between items-center">
          <h1 className={title({ color: "primary" })}>Cursos</h1>

          {user?.rol_global &&
            ["DOCENTE_EJECUTOR", "ADMINISTRADOR"].includes(user.rol_global) && (
            <Button
              color="primary"
              onPress={() => navigate("/cursos/crear-curso")}
              className="flex items-center gap-2"
            >
              {/* Icono siempre visible */}
              <Plus size={20} />

              {/* Texto solo visible en pantallas sm o mayores */}
              <span className="hidden sm:inline">Crear curso</span>
            </Button>
          )}
        </div>

        {loading && <p className="text-default-600">Cargando cursos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          // <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {cursos.length === 0 ? <p>No hay cursos disponibles</p> : (
              cursos.map((curso) => (
                // <Card key={curso.id_curso} className="max-w-[340px]">
                <Card key={curso.id_curso} className="w-full">
                  <CardHeader className="justify-between">
                    <div className="flex gap-5">
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={curso.creador?.perfil?.avatar_url ||
                          "/default-avatar.png"}
                      />
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">
                          {curso.creador?.nombre}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-400">
                          @{curso.creador?.email?.split("@")[0]}
                        </h5>
                      </div>
                    </div>
                    <Button
                      color="primary"
                      radius="full"
                      size="sm"
                      variant="solid"
                      onPress={() => navigate(`/cursos/${curso.id_curso}`)}
                    >
                      Ver detalles
                    </Button>
                  </CardHeader>

                  <CardBody className="px-3 py-0 text-small text-default-400">
                    <p className="font-semibold text-default-600">
                      {curso.titulo_curso}
                    </p>
                    <p>{curso.descripcion}</p>
                  </CardBody>

                  <CardFooter className="flex justify-between">
                    <div className="text-small text-default-400">
                      Inicio: {curso.fecha_inicio
                        ? new Date(curso.fecha_inicio).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="text-small text-default-400">
                      Fin: {curso.fecha_fin
                        ? new Date(curso.fecha_fin).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
