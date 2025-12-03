import { title } from "@/components/primitives";

export default function CheckpointsPage() { // Cambia el nombre según la página
  return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ color: "primary" })}>Checkpoints</h1>
        <p className="text-default-600">Página en construcción 🚧</p>
      </section>
  );
}