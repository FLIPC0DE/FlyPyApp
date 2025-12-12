import { useState } from "react";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { addToast, Button } from "@heroui/react";
import { title } from "@/components/primitives";
import { apiRoutes } from "@/lib/api";

export default function CambiarContraseñaPage() {
  const [form, setForm] = useState({
    nuevaPassword: "",
    confirmarPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!form.nuevaPassword || form.nuevaPassword.length < 8) {
      addToast({
        title: "Contraseña inválida",
        description: "Debe tener al menos 8 caracteres",
        color: "warning",
      });
      return;
    }

    if (form.nuevaPassword !== form.confirmarPassword) {
      addToast({
        title: "Las contraseñas no coinciden",
        description: "Verifica que ambas coincidan",
        color: "danger",
      });
      return;
    }

    try {
      const res = await fetch(apiRoutes.usuarios.actualizarPassword, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nuevaPassword: form.nuevaPassword }),
      });

      if (res.ok) {
        addToast({
          title: "Contraseña actualizada 🔒",
          description: "Tu nueva contraseña ha sido guardada",
          color: "success",
        });
        setForm({ nuevaPassword: "", confirmarPassword: "" });
      } else {
        throw new Error();
      }
    } catch {
      addToast({
        title: "Error",
        description: "No se pudo cambiar la contraseña",
        color: "danger",
      });
    }
  };

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-xl mx-auto">
      <h1 className={title({ color: "primary" })}>Cambiar Contraseña</h1>

      <Card>
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Nueva contraseña"
            type="password"
            value={form.nuevaPassword}
            onValueChange={(val) => handleChange("nuevaPassword", val)}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            value={form.confirmarPassword}
            onValueChange={(val) => handleChange("confirmarPassword", val)}
          />
          <Button color="warning" onClick={handleSubmit}>
            Cambiar contraseña
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
