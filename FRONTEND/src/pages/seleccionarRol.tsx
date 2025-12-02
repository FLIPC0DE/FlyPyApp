import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { AutenticacionContexto } from "@/context/autenticacionContexto";
import { addToast } from "@heroui/react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL!;

const rolesDisponibles = [
  { label: "Ayudante", value: "ADMIN_AYUDANTE" },
  { label: "Docente Ejecutor", value: "DOCENTE_EJECUTOR" },
  { label: "Docente Editor", value: "DOCENTE_EDITOR" },
  { label: "Estudiante", value: "ESTUDIANTE" },
];

export default function SeleccionarRolPage() {
  const { user, setUser } = useContext(AutenticacionContexto)!;
  const [rolSeleccionado, setRolSeleccionado] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.rol_global) {
      navigate("/panel-de-control");
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!rolSeleccionado) {
      addToast({
        title: "Rol requerido",
        description: "Selecciona un rol antes de continuar.",
        color: "warning",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/usuarios/rol`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rol_global: rolSeleccionado }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast({
          title: "Rol asignado ✅",
          description: `Tu rol es ahora: ${rolSeleccionado}`,
          color: "success",
        });
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/panel-de-control");
      } else {
        addToast({
          title: "Error al asignar rol",
          description: data.error || "Intenta nuevamente.",
          color: "danger",
        });
      }
    } catch (err) {
      console.error("Error al asignar rol:", err);
      addToast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-10">
        <Card className="w-full max-w-md">
          <CardBody className="gap-6">
            <h1 className={title({ color: "primary", size: "sm" })}>
              Selecciona tu rol
            </h1>

            <Select
              label="Rol en el sistema"
              labelPlacement="outside"
              placeholder="Selecciona una opción"
              selectedKeys={rolSeleccionado ? [rolSeleccionado] : []}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0];
                setRolSeleccionado(key as string);
              }}
              isRequired
            >
              {rolesDisponibles.map((rol) => (
                <SelectItem key={rol.value}>{rol.label}</SelectItem>
              ))}
            </Select>

            <Button
              color="primary"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              isDisabled={loading}
            >
              {loading ? "Asignando rol..." : "Continuar"}
            </Button>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
