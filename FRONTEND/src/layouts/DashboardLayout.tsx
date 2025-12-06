import { useContext } from "react";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import DefaultLayout from "./default";
import Sidebar from "@/components/BarraDeNavegacionLateral";

type Props = {
  children: React.ReactNode;
  mostrarSidebar?: boolean;
};

/**
 * Layout dinámico por rol
 * Envuelve las vistas existentes sin modificarlas
 * Muestra sidebar según el rol del usuario
 */
export default function DashboardLayout({ children, mostrarSidebar = true }: Props) {
  const { user, tieneRol } = useContext(AutenticacionContexto)!;

  // Determinar si mostrar sidebar según el rol
  const debeMostrarSidebar = mostrarSidebar && user?.rol_global && (
    tieneRol("DOCENTE_EJECUTOR") ||
    tieneRol("DOCENTE_EDITOR") ||
    tieneRol("ADMINISTRADOR") ||
    tieneRol("ADMIN_AYUDANTE") ||
    tieneRol("ESTUDIANTE")
  );

  // Si no debe mostrar sidebar, usar el layout por defecto
  if (!debeMostrarSidebar) {
    return <DefaultLayout>{children}</DefaultLayout>;
  }

  // Layout con sidebar para roles que lo necesitan
  return (
    <DefaultLayout>
      <div className="flex h-full min-h-[calc(100vh-4rem)]">
        {/* Sidebar - Solo visible para roles específicos */}
        <aside className="w-64 flex-shrink-0 border-r border-default-200 bg-default-50/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto min-h-[calc(100vh-4rem)]">
          <div className="w-full px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </DefaultLayout>
  );
}

