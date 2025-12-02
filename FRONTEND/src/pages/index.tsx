import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Code } from "@heroui/code";
import { title, subtitle, codeBlock } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title({ size: "lg" })}>Aprende&nbsp;</span>
          <span className={title({ color: "primary", size: "lg" })}>Python&nbsp;</span>
          <br />
          <span className={title({ size: "lg" })}>de forma&nbsp;</span>
          <span className={title({ color: "success", size: "lg" })}>interactiva</span>
          
          <div className={subtitle({ class: "mt-4" })}>
            Plataforma universitaria con cursos, ejercicios y playground integrado.
            Diseñada para estudiantes y docentes.
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            as={Link}
            color="primary"
            radius="full"
            size="lg"
            variant="shadow"
            href="/courses"
          >
            Explorar Cursos
          </Button>
          <Button
            as={Link}
            variant="bordered"
            radius="full"
            size="lg"
            href="/playground"
          >
            Probar Playground
          </Button>
        </div>

        {/* Code Example */}
        <div className="mt-8 w-full max-w-2xl">
          <div className={codeBlock()}>
            <code>
{`# Ejemplo de código Python en PyFly
def calcular_promedio(notas):
    return sum(notas) / len(notas)

notas_estudiante = [85, 90, 78, 92, 88]
promedio = calcular_promedio(notas_estudiante)
print(f"Promedio: {promedio:.2f}")`}
            </code>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-10">
        <div className="text-center mb-8">
          <h2 className={title({ size: "md" })}>
            ¿Por qué&nbsp;
            <span className={title({ color: "primary", size: "md" })}>PyFly</span>?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card>
            <CardBody className="gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold">Playground Interactivo</h3>
              </div>
              <p className="text-default-600">
                Ejecuta código Python directamente en el navegador sin necesidad de instalación.
                Powered by <Code color="primary">Pyodide</Code>.
              </p>
            </CardBody>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardBody className="gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold">Sistema de Checkpoints</h3>
              </div>
              <p className="text-default-600">
                Evaluaciones diagnósticas y calificadas con feedback inmediato.
                Sistema de semáforo para seguimiento visual.
              </p>
              <div className="flex gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-success" title="Aprobado"></div>
                <div className="w-6 h-6 rounded-full bg-warning" title="En progreso"></div>
                <div className="w-6 h-6 rounded-full bg-danger" title="Reprobado"></div>
              </div>
            </CardBody>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardBody className="gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold">Analytics Avanzado</h3>
              </div>
              <p className="text-default-600">
                Métricas detalladas de progreso, tiempo de estudio y patrones de aprendizaje
                para docentes.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-8 md:py-10">
        <div className="text-center mb-8">
          <h2 className={title({ size: "md" })}>
            Contenido&nbsp;
            <span className={title({ color: "accent", size: "md" })}>Multimedia</span>
          </h2>
          <p className={subtitle()}>
            Combina diferentes tipos de contenido para crear experiencias de aprendizaje completas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[
            { icon: "📝", title: "Texto & Imagen", desc: "Explicaciones con apoyo visual" },
            { icon: "🎥", title: "Video & Playground", desc: "Tutoriales interactivos" },
            { icon: "🎙️", title: "Audio & Slides", desc: "Presentaciones narradas" },
            { icon: "💻", title: "Código & Tests", desc: "Ejercicios prácticos" },
          ].map((item, index) => (
            <Card key={index} isPressable className="hover:scale-105 transition-transform">
              <CardBody className="text-center gap-2 py-6">
                <span className="text-4xl">{item.icon}</span>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-default-500">{item.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-10">
        <Card className="bg-gradient-to-br from-primary/10 to-success/10 border-none">
          <CardBody className="text-center gap-4 py-12">
            <h2 className={title({ size: "md" })}>
              ¿Listo para comenzar?
            </h2>
            <p className="text-default-600 max-w-xl mx-auto">
              Únete a PyFly y transforma la forma en que aprendes y enseñas Python
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Button
                as={Link}
                color="primary"
                size="lg"
                variant="shadow"
                href="/register"
              >
                Crear Cuenta
              </Button>
              <Button
                as={Link}
                variant="bordered"
                size="lg"
                href="/login"
              >
                Iniciar Sesión
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}