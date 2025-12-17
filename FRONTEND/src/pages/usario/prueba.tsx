import CrearContenidoCurso from "../../components/CrearContenidoCurso.tsx";
import BarraDeNavegacionLateral from "../../components/BarraDeNavegacionLateral.tsx";
import { title } from "@/components/primitives.ts";

export default function MyCoursesPage() {
  return (
    <div className="text-center">
          <h1 className={title({ color: "primary" })}>Mis Cursos</h1>
     <div className="flex h-screen mt-10">
          <BarraDeNavegacionLateral />
      <main className="flex-1 p-0 overflow-auto">
        <CrearContenidoCurso />
      </main>
     </div>
      
    </div>
  );
}