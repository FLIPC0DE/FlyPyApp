import { useContext, useMemo, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/context/AutenticacionContexto";
import { Eye, EyeOff } from "lucide-react";
import { addToast, ToastProvider } from "@heroui/react";
import { FlyPyIcon } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import { useRedireccion } from "@/context/redireccion.contexto";
import { ClientesLogin } from "@/components/auth/clientes";
import { apiRoutes } from "@/lib/api";

export default function LoginPage() {
  const { setUser } = useContext(AutenticacionContexto)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { destino } = useRedireccion();

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

    if (isEmailInvalid || isPasswordInvalid) {
      addToast({
        title: "Datos inválidos",
        description: "Verifica tu correo y contraseña.",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiRoutes.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode<DecodedToken>(data.token);
        setUser(decoded);
        setEmail("");
        setPassword("");

        addToast({
          title: "Inicio de sesión exitoso ✅",
          description: "Bienvenido de nuevo",
          color: "success",
        });

        sessionStorage.setItem("showWelcomeToast", "true");
        navigate(destino ?? "/dashboard");
      } else {
        addToast({
          title: "Error de autenticación",
          description: data.message || "Correo o contraseña incorrectos.",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error de red:", error);
      addToast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "google" | "microsoft" | "github") => {
    window.location.href = apiRoutes.oauth[provider];
  };

  return (
    <DefaultLayout>
      <ToastProvider placement="top-center" toastOffset={60} />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <Card>
            <CardHeader className="flex flex-col gap-1 items-center pb-6">
              <FlyPyIcon className="text-4xl" />
              <h1 className={title({ size: "sm", color: "primary" })}>
                Iniciar Sesión
              </h1>
            </CardHeader>
            <CardBody className="gap-4">
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
                placeholder="Ingresa tu contraseña"
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
              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                isDisabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </Button>
              <div className="text-center text-sm mt-2">
                <Link
                  href={`/recuperar?email=${encodeURIComponent(email)}`}
                  color="primary"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              {/* Sección de login con proveedores */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-default-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-default-500">
                    o inicia sesión con
                  </span>
                </div>
              </div>
              <ClientesLogin onLogin={handleOAuthLogin} />
              <div className="text-center text-sm mt-4">
                <Link href="/register" color="primary">
                  ¿No tienes cuenta? Regístrate
                </Link>
              </div>
            </CardBody>
          </Card>
        </form>
      </section>
    </DefaultLayout>
  );
}
