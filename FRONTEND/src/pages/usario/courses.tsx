import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { useState } from "react";

export default function CoursesPage() {
  // Estado para simular si el usuario está inscrito
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = () => {
    // TODO: Conectar con API para inscripción
    setIsEnrolled(true);
  };

  const handleAccess = () => {
    // TODO: Navegar al contenido del curso
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ color: "primary" })}>Curso de Python</h1>
        
        {/* Card de detalle del curso */}
        <div className="max-w-3xl w-full bg-content1 p-6 rounded-xl shadow-medium">
          <h2 className="text-xl font-semibold mb-4">Fundamentos de Python</h2>
          
          <div className="mb-6">
            <p className="text-default-600 mb-2">
              Aprende Python desde cero con este curso interactivo. 
              Cubriremos fundamentos, estructuras de datos y proyectos prácticos.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full">
                Principiante
              </span>
              <span className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full">
                20 horas
              </span>
            </div>
          </div>

          {/* Botón condicional */}
          {isEnrolled ? (
            <Button 
              color="primary" 
              variant="shadow" 
              onClick={handleAccess}
              className="w-full"
            >
              Acceder al Curso
            </Button>
          ) : (
            <Button 
              color="primary" 
              variant="shadow" 
              onClick={handleEnroll}
              className="w-full"
            >
              Inscribirme
            </Button>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}