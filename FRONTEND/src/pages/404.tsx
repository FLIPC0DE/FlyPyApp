import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { FlyPyIcon } from "@/assets/icons";

export default function NotFoundPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-20">
        <FlyPyIcon className="text-9xl" />
        <h1 className={title({ size: "lg" })}>404</h1>
        <p className="text-xl text-default-600">Página no encontrada</p>
        <Button as={Link} color="primary" href="/" size="lg" variant="shadow">
          Volver al Inicio
        </Button>
      </section>
    </DefaultLayout>
  );
}
