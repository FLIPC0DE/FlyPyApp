import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { useState, useEffect, useCallback } from "react";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { addToast } from "@heroui/react";
import { InscripcionService } from "@/services/inscripcion.service";
import type { EstadoInscripcion } from "@/services/inscripcion.service";

interface CursoPublicado {
  id_curso: number;
  titulo_curso: string;
  descripcion: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  slug: string;
  creador: {
    nombre: string;
    email: string;
  };
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function CoursesPage() {
  const [cursos, setCursos] = useState<CursoPublicado[]>([]);
  const [estadosInscripcion, setEstadosInscripcion] = useState<Record<number, EstadoInscripcion>>({});
  const [loading, setLoading] = useState(true);
  const [inscribiendo, setInscribiendo] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const cargarEstadosInscripcion = useCallback(async (cursosData: CursoPublicado[]) => {
    if (!user || cursosData.length === 0) return;

    try {
      const estados: Record<number, EstadoInscripcion> = {};
      
      // Cargar estados en paralelo para mejor rendimiento
      const promesas = cursosData.map(async (curso: CursoPublicado) => {
        try {
          const estado = await InscripcionService.obtenerEstadoInscripcion(curso.id_curso);
          estados[curso.id_curso] = estado;
        } catch (error) {
          console.error(`Error al cargar estado para curso ${curso.id_curso}:`, error);
          // Estado por defecto si hay error
          estados[curso.id_curso] = { inscrito: false, estado: null };
        }
      });

      await Promise.all(promesas);
      setEstadosInscripcion(estados);
    } catch (error) {
      console.error("Error al cargar estados de inscripción:", error);
    }
  }, [user]);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      
      try {
        // Cargar cursos publicados
        const response = await fetch(`${BACKEND_URL}/api/cursos/publicados`);
        if (!response.ok) {
          throw new Error("Error al cargar cursos");
        }

        const cursosData: CursoPublicado[] = await response.json();
        setCursos(cursosData);

        // Cargar estados de inscripción si el usuario está autenticado
        await cargarEstadosInscripcion(cursosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar los cursos. Intenta recargar la página.",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user, cargarEstadosInscripcion]);

  const handleInscribirse = async (cursoId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setInscribiendo(cursoId);

    try {
      const data = await InscripcionService.inscribirACurso(cursoId);
      
      // Actualizar estado de inscripción localmente
      setEstadosInscripcion((prev) => ({
        ...prev,
        [cursoId]: {
          inscrito: true,
          estado: "active",
          progress: 0,
        },
      }));

      addToast({
        title: data.esReinscripcion ? "✅ Reinscripción exitosa" : "✅ Inscripción exitosa",
        description: data.esReinscripcion 
          ? "Te has vuelto a inscribir al curso correctamente"
          : "Te has inscrito correctamente al curso",
        color: "success",
      });
    } catch (error: any) {
      console.error("Error al inscribirse:", error);
      addToast({
        title: "Error al inscribirse",
        description: error.message || "No se pudo completar la inscripción. Intenta nuevamente.",
        color: "danger",
      });
    } finally {
      setInscribiendo(null);
    }
  };


  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ color: "primary" })}>Cursos Disponibles</h1>
        <p className="text-default-500 text-sm mb-6">
          Explora nuestros cursos publicados y comienza tu aprendizaje
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-default-500 text-sm">Cargando cursos...</p>
          </div>
        ) : cursos.length === 0 ? (
          <Card className="w-full max-w-2xl">
            <CardBody className="p-8 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-default-300" />
              <h3 className="text-xl font-semibold mb-2">No hay cursos disponibles</h3>
              <p className="text-default-500">
                Pronto agregaremos nuevos cursos para ti
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="w-full max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursos.map((curso) => (
                <Card key={curso.id_curso} className="hover:shadow-lg transition-shadow">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-default-800 mb-2 line-clamp-2">
                          {curso.titulo_curso}
                        </h3>
                        <p className="text-sm text-default-600 line-clamp-3 mb-4">
                          {curso.descripcion || "Sin descripción disponible"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {curso.creador && (
                        <div className="flex items-center gap-2 text-xs text-default-500">
                          <User className="w-4 h-4" />
                          <span className="line-clamp-1">{curso.creador.nombre}</span>
                        </div>
                      )}
                      {curso.fecha_inicio && (
                        <div className="flex items-center gap-2 text-xs text-default-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(curso.fecha_inicio).toLocaleDateString()}
                            {curso.fecha_fin && 
                              ` - ${new Date(curso.fecha_fin).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {(() => {
                      const estado = estadosInscripcion[curso.id_curso];
                      const estaInscrito = estado?.inscrito && estado?.estado === "active";
                      const estaCancelado = estado?.inscrito && estado?.estado === "canceled";

                      if (estaInscrito) {
                        return (
                          <Button
                            color="success"
                            variant="flat"
                            className="w-full"
                            onClick={() => navigate("/my-courses")}
                            endContent={<ArrowRight className="w-4 h-4" />}
                          >
                            Ya Inscrito - Ver Curso
                          </Button>
                        );
                      }

                      if (estaCancelado) {
                        return (
                          <Button
                            color="primary"
                            variant="shadow"
                            className="w-full"
                            onClick={() => handleInscribirse(curso.id_curso)}
                            endContent={<ArrowRight className="w-4 h-4" />}
                            isLoading={inscribiendo === curso.id_curso}
                            isDisabled={inscribiendo !== null}
                          >
                            {inscribiendo === curso.id_curso ? "Inscribiendo..." : "Volver a Inscribirme"}
                          </Button>
                        );
                      }

                      return (
                        <Button
                          color="primary"
                          variant="shadow"
                          className="w-full"
                          onClick={() => handleInscribirse(curso.id_curso)}
                          endContent={<ArrowRight className="w-4 h-4" />}
                          isDisabled={!user || inscribiendo !== null}
                          isLoading={inscribiendo === curso.id_curso}
                        >
                          {inscribiendo === curso.id_curso 
                            ? "Inscribiendo..." 
                            : user 
                              ? "Inscribirme" 
                              : "Inicia sesión para inscribirte"}
                        </Button>
                      );
                    })()}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}