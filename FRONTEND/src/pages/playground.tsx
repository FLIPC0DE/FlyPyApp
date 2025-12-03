import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import {Card, CardBody} from "@heroui/card";
import { Button } from "@heroui/button";

export default function PlaygroundPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col gap-4 py-8 md:py-10">
        <div className="text-center">
          <h1 className={title({ color: "success" })}>Python Playground</h1>
          <p className="mt-4 text-default-600">
            Editor interactivo para ejecutar código Python en el navegador
          </p>
        </div>

        <Card className="mt-8">
          <CardBody className="gap-4">
            <div className="bg-content2 rounded-lg p-4 font-mono text-sm min-h-[400px]">
            </div>
            <div className="flex gap-2">
              <Button color="success" variant="shadow">
                ▶ Ejecutar
              </Button>
              <Button variant="flat">
                🔄 Reiniciar
              </Button>
            </div>
            <div className="bg-content1 border-2 border-divider rounded-lg p-4 font-mono text-sm min-h-[100px]">
              <p className="text-success">Salida:</p>
              <p className="text-default-600 mt-2">
                (Aquí aparecerá la salida de tu código)
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
