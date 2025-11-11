import { title } from "@/components/primitives";
import ContenidoCurso from "@/components/CrearContenidoCurso.tsx";
import FormularioCrearCurso from "@/components/FormularioCrearCurso.tsx";
import Sidebar from "@/components/BarraDeNavegacionLateral.tsx";

export default function MyCoursesPage() { // Cambia el nombre según la página
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