import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function CoursesPage() { // Cambia el nombre según la página
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ color: "primary" })}>Cursos</h1>
        <p className="text-default-600">Página en construcción 🚧</p>
      </section>
    </DefaultLayout>
  );
}