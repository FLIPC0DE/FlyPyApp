// FRONTEND/src/pages/cursos/detalle.tsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRoutes } from "@/lib/api";
import DefaultLayout from "@/layouts/default";
import { Curso } from "@/types/curso";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { AutenticacionContexto } from "@/context/autenticacionContexto";

export default function CursoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AutenticacionContexto)!;

  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiRoutes.cursos.detalle(Number(id)), {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Error al obtener curso");

        const data = await res.json();
        setCurso(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, [id]);

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-6 py-8 md:py-10">
        {loading && <p className="text-default-600">Cargando curso...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Botón de edición solo si hay curso cargado y el rol lo permite */}
        {!loading && !error && curso && user?.rol_global &&
          ["ADMINISTRADOR", "DOCENTE_EJECUTOR", "DOCENTE_EDITOR", "ADMIN_AYUDANTE"].includes(user.rol_global) && (
          <Button
            color="warning"
            onPress={() => navigate(`/cursos/${curso.id_curso}/editar`)}
            className="w-fit mx-auto"
          >
            Editar curso
          </Button>
        )}

        {!loading && !error && curso && (
          <Card className="max-w-[600px] mx-auto">
            <CardHeader className="flex gap-5 items-center">
              <Avatar
                isBordered
                radius="full"
                size="lg"
                src={curso.creador?.perfil?.avatar_url || "/default-avatar.png"}
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-default-600">
                  {curso.titulo_curso}
                </h2>
                <p className="text-small text-default-400">
                  Creado por: {curso.creador?.nombre} ({curso.creador?.email})
                </p>
              </div>
            </CardHeader>

            <CardBody className="px-6 py-4 text-default-600">
              <p>{curso.descripcion}</p>
            </CardBody>

            <CardFooter className="flex justify-between px-6">
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
        )}
      </section>
    </DefaultLayout>
  );
}
