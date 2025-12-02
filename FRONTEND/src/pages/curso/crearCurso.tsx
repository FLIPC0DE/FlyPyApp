import React, { useContext, useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Textarea } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, today } from "@internationalized/date";
import { apiRoutes } from "@/lib/api";
import { AutenticacionContexto } from "@/context/autenticacionContexto";
import { addToast } from "@heroui/react";

export default function CrearCursoPage() {
  const auth = useContext(AutenticacionContexto);
  const token = auth?.token;

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState<any>(today(getLocalTimeZone()));
  const [fechaFin, setFechaFin] = useState<any>(null);

  const [tituloError, setTituloError] = useState<string | null>(null);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);

  const toISODate = (dv: any) =>
    dv ? dv.toDate("UTC").toISOString().slice(0, 10) : null;

  // Validación reactiva mientras escribe
  useEffect(() => {
    if (titulo.length > 0 && (titulo.length < 10 || titulo.length > 80)) {
      setTituloError("El título debe tener entre 10 y 80 caracteres.");
    } else {
      setTituloError(null);
    }

    if (descripcion.length > 0 && (descripcion.length < 10 || descripcion.length > 150)) {
      setDescripcionError("La descripción debe tener entre 10 y 150 caracteres.");
    } else {
      setDescripcionError(null);
    }
  }, [titulo, descripcion]);

  const formValido =
    titulo.length >= 10 &&
    titulo.length <= 80 &&
    descripcion.length >= 10 &&
    descripcion.length <= 150 &&
    fechaInicio &&
    fechaFin &&
    fechaFin.compare(fechaInicio) >= 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inicioISO = toISODate(fechaInicio);
    const finISO = toISODate(fechaFin);

    try {
      const res = await fetch(apiRoutes.cursos.crear, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          titulo_curso: titulo.trim(),
          descripcion: descripcion.trim(),
          fecha_inicio: inicioISO,
          fecha_fin: finISO,
        }),
      });

      if (res.ok) {
        addToast({
          title: "Curso creado ✅",
          description: `El curso "${titulo}" fue creado con éxito.`,
          color: "success",
        });
        setTitulo("");
        setDescripcion("");
        setFechaInicio(today(getLocalTimeZone()));
        setFechaFin(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        addToast({
          title: "Error al crear curso ❌",
          description: errorData.error || "No se pudo crear el curso.",
          color: "danger",
        });
      }
    } catch (error: any) {
      addToast({
        title: "Error de conexión ⚠️",
        description: error.message || "No se pudo conectar con el servidor.",
        color: "warning",
      });
    }
  };

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Crear Curso</h1>

      <I18nProvider locale="es-ES">
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1 w-full">
            <Input
              isRequired
              name="titulo"
              label="Título del curso"
              labelPlacement="outside"
              placeholder="Introduce el título"
              value={titulo}
              onValueChange={(val) => {
                if (val.length <= 80) setTitulo(val); // límite máximo
              }}
              errorMessage={tituloError || "El título es obligatorio (10-80 caracteres)"}
            />
            <span
              className={`text-xs self-end ${
                titulo.length < 10 || titulo.length > 80
                  ? "text-danger"
                  : "text-default-400"
              }`}
            >
              {titulo.length}/80
            </span>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Textarea
              isRequired
              name="descripcion"
              label="Descripción"
              labelPlacement="outside"
              placeholder="Describe brevemente el curso"
              value={descripcion}
              onValueChange={(val) => {
                if (val.length <= 150) setDescripcion(val); // límite máximo
              }}
              errorMessage={descripcionError || "La descripción es obligatoria (10-150 caracteres)"}
              minRows={3}
            />
            <span
              className={`text-xs self-end ${
                descripcion.length < 10 || descripcion.length > 150
                  ? "text-danger"
                  : "text-default-400"
              }`}
            >
              {descripcion.length}/150
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <DatePicker
              isRequired
              label="Fecha de inicio"
              labelPlacement="outside"
              className="max-w-[284px]"
              value={fechaInicio}
              onChange={setFechaInicio}
              variant="bordered"
              defaultValue={today(getLocalTimeZone())}
            />

            <DatePicker
              isRequired
              label="Fecha de fin"
              labelPlacement="outside"
              className="max-w-[284px]"
              value={fechaFin}
              onChange={setFechaFin}
              variant="bordered"
              minValue={fechaInicio}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full"
            isDisabled={!formValido}
          >
            Guardar
          </Button>
        </Form>
      </I18nProvider>
    </section>
  );
}
