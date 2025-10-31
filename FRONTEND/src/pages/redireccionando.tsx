import { Spinner } from "@heroui/spinner";
import DefaultLayout from "@/layouts/default";

export default function Redireccionando({ destino }: { destino: string }) {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500 text-sm">
          Redirigiendo a <span className="font-semibold">{destino}</span>...
        </p>
      </section>
    </DefaultLayout>
  );
}
