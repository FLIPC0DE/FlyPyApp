import { title } from "@/components/primitives";
import ContenidoCurso from "@/components/CrearContenidoCurso.tsx";
import Sidebar from "@/components/BarraDeNavegacionLateral.tsx";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/config/roles.config";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useState, useEffect } from "react";
import { BookOpen, Calendar, Edit, User, ArrowRight, X } from "lucide-react";
import { addToast } from "@heroui/react";
import { InscripcionService } from "@/services/inscripcion.service";
import { useNavigate } from "react-router-dom";

interface Curso {
  id_curso: number;
  titulo_curso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  publicado: boolean;
  estado: string;
}

export default function MyCoursesPage() {
  const { tieneRol } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarConstructor, setMostrarConstructor] = useState(false);
  //const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);

  // Cargar cursos del docente ejecutor
  useEffect(() => {
    if (tieneRol(ROLES.DOCENTE_EJECUTOR)) {
      const cargarCursos = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/cursos/listarCursos");
          if (response.ok) {
            const data = await response.json();
            setCursos(data);
          }
        } catch (error) {
          console.error("Error al cargar cursos:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarCursos();
    } else {
      setLoading(false);
    }
  }, [tieneRol]);

  // Vista específica para DOCENTE_EJECUTOR
  if (tieneRol(ROLES.DOCENTE_EJECUTOR)) {
    if (mostrarConstructor) {
      return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="w-full flex items-center justify-between mb-4">
            <h1 className={title({ color: "primary" })}>Crear Contenido</h1>
            <Button
              variant="light"
              onClick={() => {
                setMostrarConstructor(false);
                //setCursoSeleccionado(null);
              }}
            >
              ← Volver a Mis Cursos
            </Button>
          </div>
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1">
              <ContenidoCurso />
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ color: "primary" })}>Mis Cursos</h1>
        
        <div className="flex w-full">
          <Sidebar />
          
          <div className="flex-1 ml-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-default-500 text-sm">Cargando cursos...</p>
              </div>
            ) : (
              <>
                {cursos.length === 0 ? (
                  <Card className="w-full">
                    <CardBody className="p-8 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-default-300" />
                      <h3 className="text-xl font-semibold mb-2">No tienes cursos creados</h3>
                      <p className="text-default-500 mb-4">
                        Usa el panel lateral para crear tu primer curso
                      </p>
                    </CardBody>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {cursos.map((curso) => (
                      <Card key={curso.id_curso} className="hover:shadow-lg transition-shadow">
                        <CardBody className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-default-800 mb-1 line-clamp-2">
                                {curso.titulo_curso}
                              </h3>
                              <p className="text-sm text-default-500 line-clamp-2 mb-3">
                                {curso.descripcion || "Sin descripción"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-default-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {curso.fecha_inicio
                                  ? new Date(curso.fecha_inicio).toLocaleDateString()
                                  : "Sin fecha"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  curso.publicado
                                    ? "bg-success/20 text-success"
                                    : "bg-warning/20 text-warning"
                                }`}
                              >
                                {curso.publicado ? "Publicado" : "Borrador"}
                              </span>
                              {curso.estado && (
                                <span className="text-xs px-2 py-1 rounded-full bg-default-100 text-default-600">
                                  {curso.estado}
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            color="primary"
                            variant="flat"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              //setCursoSeleccionado(curso);
                              setMostrarConstructor(true);
                            }}
                            startContent={<Edit className="w-4 h-4" />}
                          >
                            Gestionar Contenido
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Vista específica para ESTUDIANTE
  if (tieneRol(ROLES.ESTUDIANTE)) {
    interface CursoInscrito {
      id_curso: number;
      titulo_curso: string;
      descripcion: string | null;
      fecha_inicio: string | null;
      fecha_fin: string | null;
      creador: {
        nombre: string;
        email: string;
      };
      inscripcion: {
        id_inscripcion: number;
        fecha_inscripcion: string;
        progress: number | null;
        estado: string;
      };
    }

    const [cursosInscritos, setCursosInscritos] = useState<CursoInscrito[]>([]);
    const [loadingInscritos, setLoadingInscritos] = useState(true);
    const [desinscribiendo, setDesinscribiendo] = useState<number | null>(null);
    const navigate = useNavigate();

    const cargarCursosInscritos = async () => {
      try {
        const data = await InscripcionService.obtenerCursosInscritos();
        setCursosInscritos(data);
      } catch (error: any) {
        console.error("Error al cargar cursos inscritos:", error);
        if (error.message !== "Token inválido o expirado") {
          addToast({
            title: "Error",
            description: "No se pudieron cargar tus cursos. Intenta recargar la página.",
            color: "danger",
          });
        }
      } finally {
        setLoadingInscritos(false);
      }
    };

    useEffect(() => {
      cargarCursosInscritos();
    }, []);

    const handleDesinscribirse = async (cursoId: number) => {
      if (!confirm("¿Estás seguro de que quieres desinscribirte de este curso?")) {
        return;
      }

      setDesinscribiendo(cursoId);

      try {
        await InscripcionService.cancelarInscripcion(cursoId);
        
        addToast({
          title: "✅ Desinscripción exitosa",
          description: "Te has desinscrito del curso correctamente. Puedes volver a inscribirte cuando quieras.",
          color: "success",
        });

        // Recargar la lista de cursos
        await cargarCursosInscritos();
      } catch (error: any) {
        console.error("Error al desinscribirse:", error);
        addToast({
          title: "Error al desinscribirse",
          description: error.message || "No se pudo completar la desinscripción. Intenta nuevamente.",
          color: "danger",
        });
      } finally {
        setDesinscribiendo(null);
      }
    };

    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-6xl">
          <div className="mb-6">
            <h1 className={title({ color: "primary" })}>Mis Cursos Inscritos</h1>
            <p className="text-default-500 text-sm mt-2">
              Aquí puedes ver todos los cursos en los que estás inscrito
            </p>
          </div>

          {loadingInscritos ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Spinner size="lg" color="primary" />
              <p className="text-default-500 text-sm">Cargando tus cursos...</p>
            </div>
          ) : cursosInscritos.length === 0 ? (
            <Card className="w-full">
              <CardBody className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-default-300" />
                <h3 className="text-xl font-semibold mb-2">No estás inscrito en ningún curso</h3>
                <p className="text-default-500 mb-4">
                  Explora los cursos disponibles e inscríbete para comenzar tu aprendizaje
                </p>
                <Button
                  color="primary"
                  variant="shadow"
                  onClick={() => window.location.href = "/courses"}
                >
                  Ver Cursos Disponibles
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursosInscritos.map((curso: CursoInscrito) => (
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

                    <div className="space-y-3 mb-4">
                      {curso.creador && (
                        <div className="flex items-center gap-2 text-xs text-default-500">
                          <User className="w-4 h-4" />
                          <span className="line-clamp-1">Por: {curso.creador.nombre}</span>
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
                      {curso.inscripcion && (
                        <div className="flex items-center justify-between pt-2 border-t border-default-200">
                          <span className="text-xs text-default-500">Progreso</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-default-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${curso.inscripcion.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-default-700">
                              {Math.round(curso.inscripcion.progress || 0)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        color="primary"
                        variant="shadow"
                        className="w-full"
                        onClick={() => {
                          // Navegar al contenido del curso (implementar cuando esté listo)
                          navigate(`/curso/${curso.id_curso}`);
                        }}
                        endContent={<ArrowRight className="w-4 h-4" />}
                      >
                        Continuar Curso
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDesinscribirse(curso.id_curso)}
                        startContent={<X className="w-4 h-4" />}
                        isLoading={desinscribiendo === curso.id_curso}
                        isDisabled={desinscribiendo !== null}
                      >
                        {desinscribiendo === curso.id_curso ? "Desinscribiendo..." : "Desinscribirme"}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Vista original para otros roles (DOCENTE_EDITOR, etc.)
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className={title({ color: "primary" })}>Mis Cursos</h1>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <ContenidoCurso />
        </div>
      </div>
    </section>
  );
}