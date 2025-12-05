import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import { addToast } from "@heroui/react";
import { UsuarioService } from "@/services/usuario.service";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/context/AutenticacionContexto";

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
      navigate("/dashboard");
    }
  }, [user]);

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
      // Usar el servicio en lugar de fetch directo
      const data = await UsuarioService.actualizarRol(rolSeleccionado);
      
      addToast({
        title: "Rol asignado ✅",
        description: `Tu rol es ahora: ${rolSeleccionado}`,
        color: "success",
      });
      
      // Actualizar token y usuario
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode<DecodedToken>(data.token);
      setUser(decoded);
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error al asignar rol:", err);
      addToast({
        title: "Error al asignar rol",
        description: err.message || "No se pudo conectar con el servidor.",
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
