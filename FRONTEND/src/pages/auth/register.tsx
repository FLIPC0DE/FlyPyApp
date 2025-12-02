import { useEffect, useMemo, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
// import { Select, SelectItem } from "@heroui/select";
import { Eye, EyeOff } from "lucide-react";
import { addToast } from "@heroui/react";
import { FlyPyIcon } from "@/assets/icons";
import { ClientesLogin } from "@/components/auth/clientes";
import { apiRoutes } from "@/lib/api";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [codigoVerificacion, setCodigoVerificacion] = useState("");
  const [password, setPassword] = useState("");
  // const [id_rol, setRol] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [temporizador, setTemporizador] = useState(0);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

  const isEmailInvalid = useMemo(() => {
    if (email === "") return false;
    return !validateEmail(email);
  }, [email]);

  const isPasswordInvalid = useMemo(() => {
    if (password === "") return false;
    return password.length < 8;
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEmailInvalid || isPasswordInvalid || !codigoVerificacion) {
      addToast({
        title: "Datos inválidos",
        description: "Verifica tu correo, contraseña y código.",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiRoutes.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          // id_rol: Number(id_rol),
          codigoVerificacion,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("showWelcomeToast", "true");
        window.location.href = data.redirectTo || "/dashboard";
      } else if (response.ok) {
        addToast({
          title: "Registro exitoso ✅",
          description: "Tu cuenta ha sido creada, pero no se recibió token",
          color: "warning",
        });
      } else {
        addToast({
          title: "Error al registrar",
          description: data.error || "Intenta nuevamente",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      addToast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarCodigo = async () => {
    if (!email || isEmailInvalid) return;

    setCodigoEnviado(true);
    setTemporizador(60);

    try {
      await fetch(apiRoutes.verificacion.enviar, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      addToast({
        title: "Código enviado ✅",
        description: `Se ha enviado un código de verificación a ${email}`,
        color: "success",
      });
    } catch (error) {
      console.error("Error al enviar código:", error);
      addToast({
        title: "Error al enviar código",
        description: "No se pudo enviar el correo",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (temporizador > 0) {
      intervalo = setInterval(() => {
        setTemporizador((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [temporizador]);

  const handleOAuthLogin = (provider: "google" | "microsoft" | "github") => {
    window.location.href = apiRoutes.oauth[provider];
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <Card>
            <CardHeader className="flex flex-col gap-1 items-center pb-6">
              <FlyPyIcon className="text-4xl" />
              <h1 className={title({ size: "sm", color: "success" })}>
                Crear Cuenta
              </h1>
            </CardHeader>
            <CardBody className="gap-4">
              <Input
                label="Nombre completo"
                labelPlacement="outside"
                placeholder="Tu nombre"
                variant="bordered"
                value={nombre}
                onValueChange={setNombre}
                isRequired
              />
              <Input
                label="Correo electrónico"
                labelPlacement="outside"
                placeholder="tu@email.com"
                type="email"
                variant="bordered"
                value={email}
                onValueChange={setEmail}
                isInvalid={isEmailInvalid}
                errorMessage="El correo electrónico no tiene un formato válido"
                isRequired
              />
              <Input
                label="Contraseña"
                labelPlacement="outside"
                placeholder="Crea una contraseña"
                type={isPasswordVisible ? "text" : "password"}
                variant="bordered"
                value={password}
                onValueChange={setPassword}
                isInvalid={isPasswordInvalid}
                errorMessage="La contraseña debe tener al menos 8 caracteres"
                isRequired
                endContent={
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="focus:outline-none"
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {isPasswordVisible
                      ? <EyeOff className="w-5 h-5 text-default-400" />
                      : <Eye className="w-5 h-5 text-default-400" />}
                  </button>
                }
              />
              {/* <Select
                label="Tipo de cuenta"
                labelPlacement="outside"
                placeholder="Selecciona tu rol"
                variant="bordered"
                selectedKeys={id_rol ? [String(id_rol)] : []}
                onSelectionChange={(keys) => setRol(Array.from(keys)[0])}
              >
                <SelectItem key="1">Administrador Ayudante</SelectItem>
                <SelectItem key="2">Docente Ejecutor</SelectItem>
                <SelectItem key="3">Docente Editor</SelectItem>
                <SelectItem key="4">Estudiante</SelectItem>
              </Select> */}
              <div className="flex items-end gap-2">
                <Input
                  label="Código de verificación"
                  labelPlacement="outside"
                  placeholder="Ingresa el código recibido por correo"
                  variant="bordered"
                  value={codigoVerificacion}
                  onValueChange={setCodigoVerificacion}
                  isRequired
                  className="flex-1"
                />
                <Button
                  type="button"
                  color={codigoEnviado ? "default" : "success"}
                  isDisabled={!email || isEmailInvalid || temporizador > 0}
                  onClick={handleSolicitarCodigo}
                >
                  {temporizador > 0 ? `Espera ${temporizador}s` : "Solicitar"}
                </Button>
              </div>
              {codigoEnviado && (
                <p className="text-sm text-green-500 mt-1 text-center">
                  Código enviado al correo: <strong>{email}</strong>
                </p>
              )}
              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                isDisabled={loading ||
                  !codigoEnviado ||
                  !email ||
                  isEmailInvalid ||
                  isPasswordInvalid ||
                  !codigoVerificacion}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </Button>

              {/* Login con proveedores */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-default-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-default-500">
                    o regístrate con
                  </span>
                </div>
              </div>
              <ClientesLogin onLogin={handleOAuthLogin} />
              <div className="text-center text-sm mt-2">
                <Link href="/login" color="primary">
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </div>
            </CardBody>
          </Card>
        </form>
      </section>
    </DefaultLayout>
  );
}
