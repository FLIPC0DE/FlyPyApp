// import { title } from "@/components/primitives";

// export default function ProfilePage() { // Cambia el nombre según la página
//   return (
//       <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//         <h1 className={title({ color: "primary" })}>Perfil</h1>
//         <p className="text-default-600">Página en construcción 🚧</p>
//       </section>
//   );
// }

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button, Chip } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { title } from "@/components/primitives";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/config/roles.config";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  Users, 
  BookOpen, 
  Calendar,
  Edit,
  Key,
  TrendingUp
} from "lucide-react";
import { UsuarioService } from "@/services/usuario.service";

interface PerfilCompleto {
  perfil: {
    id_usuario: number;
    avatar_url: string | null;
    institucion: string | null;
    carrera: string | null;
    grupo: string | null;
  };
  usuario: {
    id_usuario: number;
    nombre: string;
    email: string;
    rol_global: string | null;
    createdAt: string;
  };
  estadisticas: {
    cursosInscritos?: number;
    progresoPromedio?: number;
    cursosCreados?: number;
    cursosPublicados?: number;
  };
}

export default function ProfilePage() {
  const { user, tieneRol } = useAuth();
  const navigate = useNavigate();
  const [perfilCompleto, setPerfilCompleto] = useState<PerfilCompleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await UsuarioService.obtenerPerfilCompleto();
        setPerfilCompleto(data);
      } catch (error: any) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      cargarPerfil();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500 text-sm">Cargando perfil...</p>
      </section>
    );
  }

  if (!perfilCompleto) {
    return (
      <section className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-default-500">No se pudo cargar el perfil</p>
      </section>
    );
  }

  const { perfil, usuario, estadisticas } = perfilCompleto;
  const fechaCreacion = usuario.createdAt
    ? new Date(usuario.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const esEstudiante = tieneRol(ROLES.ESTUDIANTE);
  const esDocente = tieneRol(ROLES.DOCENTE_EJECUTOR) || tieneRol(ROLES.DOCENTE_EDITOR);

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className={title({ color: "primary" })}>Mi Perfil</h1>
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<Edit className="w-4 h-4" />}
            onClick={() => navigate("/editar-perfil")}
          >
            Editar
          </Button>
          <Button
            color="default"
            variant="light"
            startContent={<Key className="w-4 h-4" />}
            onClick={() => navigate("/cambiar-contraseña")}
          >
            Contraseña
          </Button>
        </div>
      </div>

      {/* Información Principal */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center md:items-start">
              {perfil.avatar_url ? (
                <img
                  src={perfil.avatar_url}
                  alt="Foto de perfil"
                  className="rounded-full w-32 h-32 object-cover border-4 border-primary/20 mb-4"
                />
              ) : (
                <div className="rounded-full w-32 h-32 bg-primary/10 flex items-center justify-center border-4 border-primary/20 mb-4">
                  <User className="w-16 h-16 text-primary/50" />
                </div>
              )}
              <Chip
                color="primary"
                variant="flat"
                className="capitalize"
              >
                {usuario.rol_global?.replace("_", " ") || "Sin rol"}
              </Chip>
            </div>

            {/* Información Básica */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-default-800 mb-1">
                  {usuario.nombre}
                </h2>
                <div className="flex items-center gap-2 text-default-500 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{usuario.email}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-default-200">
                {perfil.institucion && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-default-500 uppercase">Institución</p>
                      <p className="text-sm font-medium">{perfil.institucion}</p>
                    </div>
                  </div>
                )}

                {perfil.carrera && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-default-500 uppercase">Carrera</p>
                      <p className="text-sm font-medium">{perfil.carrera}</p>
                    </div>
                  </div>
                )}

                {perfil.grupo && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-default-500 uppercase">Grupo</p>
                      <p className="text-sm font-medium">{perfil.grupo}</p>
                    </div>
                  </div>
                )}

                {fechaCreacion && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-default-500 uppercase">Miembro desde</p>
                      <p className="text-sm font-medium">{fechaCreacion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Estadísticas según el rol */}
      {esEstudiante && estadisticas.cursosInscritos !== undefined && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500 mb-1">Cursos Inscritos</p>
                  <p className="text-3xl font-bold text-primary">
                    {estadisticas.cursosInscritos}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-primary/30" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-success/5 border-success/20">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500 mb-1">Progreso Promedio</p>
                  <p className="text-3xl font-bold text-success">
                    {estadisticas.progresoPromedio || 0}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-success/30" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {esDocente && estadisticas.cursosCreados !== undefined && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500 mb-1">Cursos Creados</p>
                  <p className="text-3xl font-bold text-primary">
                    {estadisticas.cursosCreados}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-primary/30" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-success/5 border-success/20">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500 mb-1">Cursos Publicados</p>
                  <p className="text-3xl font-bold text-success">
                    {estadisticas.cursosPublicados || 0}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-success/30" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </section>
  );
}

