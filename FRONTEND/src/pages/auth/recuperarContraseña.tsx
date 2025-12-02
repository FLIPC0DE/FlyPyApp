import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRoutes } from "@/lib/api";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { addToast } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Eye, EyeOff } from "lucide-react";

export default function RecuperarContraseñaPage() {
    const [params] = useSearchParams();
    const [email, setEmail] = useState(params.get("email") || "");
    const [codigo, setCodigo] = useState("");
    const [fase, setFase] = useState<"verificar" | "cambiar">("verificar");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [repetirPassword, setRepetirPassword] = useState("");
    const [temporizador, setTemporizador] = useState(0);
    const [verPassword, setVerPassword] = useState(false);
    const [verRepetirPassword, setVerRepetirPassword] = useState(false);
    const isNuevaPasswordInvalid = nuevaPassword !== "" &&
        nuevaPassword.length < 8;
    const isRepetirPasswordInvalid = repetirPassword !== "" &&
        repetirPassword.length < 8;

    const isEmailInvalid = useMemo(() => {
        if (email === "") return false;
        return !email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
    }, [email]);

    const handleEnviarCodigo = async () => {
        if (!email || isEmailInvalid) return;

        setTemporizador(60);
        try {
            await fetch(apiRoutes.auth.recuperar, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            addToast({
                title: "Código enviado ✅",
                description: `Se ha enviado un código a ${email}`,
                color: "success",
            });
        } catch {
            addToast({
                title: "Error al enviar código",
                description: "No se pudo enviar el correo",
                color: "danger",
            });
        }
    };

    const handleValidarCodigo = async () => {
        try {
            const res = await fetch(apiRoutes.auth.validarRecuperacion, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, codigo }),
            });

            const data = await res.json();
            if (res.ok) {
                setFase("cambiar");
                addToast({
                    title: "Código válido ✅",
                    description: "Ahora puedes cambiar tu contraseña",
                    color: "success",
                });
            } else {
                addToast({
                    title: "Código inválido",
                    description: data.error || "Verifica el código",
                    color: "danger",
                });
            }
        } catch {
            addToast({
                title: "Error de validación",
                description: "No se pudo validar el código",
                color: "danger",
            });
        }
    };

    const handleCambiarPassword = async () => {
        if (nuevaPassword.length < 8 || nuevaPassword !== repetirPassword) {
            addToast({
                title: "Contraseña inválida",
                description:
                    "Verifica que ambas contraseñas coincidan y tengan al menos 8 caracteres",
                color: "danger",
            });
            return;
        }

        try {
            const res = await fetch(apiRoutes.auth.cambiarPassword, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, nuevaPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                addToast({
                    title: "Contraseña actualizada ✅",
                    description: "Ya puedes iniciar sesión",
                    color: "success",
                });
                window.location.href = "/login";
            } else {
                addToast({
                    title: "Error al cambiar contraseña",
                    description: data.error || "Intenta nuevamente",
                    color: "danger",
                });
            }
        } catch {
            addToast({
                title: "Error de conexión",
                description: "No se pudo conectar con el servidor",
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

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center py-8 md:py-10">
                <form className="w-full max-w-md">
                    <Card>
                        <CardHeader className="flex flex-col gap-1 items-center pb-6">
                            <h1
                                className={title({
                                    size: "sm",
                                    color: "primary",
                                })}
                            >
                                Recuperar Contraseña
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
                                errorMessage="Formato de correo inválido"
                                isRequired
                            />
                            {fase === "verificar"
                                ? (
                                    <>
                                        <div className="flex gap-2 items-end">
                                            <Input
                                                label="Código recibido"
                                                labelPlacement="outside"
                                                placeholder="Ingresa el código"
                                                variant="bordered"
                                                value={codigo}
                                                onValueChange={setCodigo}
                                                isRequired
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                color="success"
                                                onClick={handleEnviarCodigo}
                                                isDisabled={!email ||
                                                    isEmailInvalid ||
                                                    temporizador > 0}
                                            >
                                                {temporizador > 0
                                                    ? `Espera ${temporizador}s`
                                                    : "Enviar código"}
                                            </Button>
                                        </div>
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="w-full"
                                            onClick={handleValidarCodigo}
                                            isDisabled={!codigo}
                                        >
                                            Validar código
                                        </Button>
                                    </>
                                )
                                : (
                                    <>
                                        <Input
                                            label="Nueva contraseña"
                                            labelPlacement="outside"
                                            placeholder="Mínimo 8 caracteres"
                                            type={verPassword
                                                ? "text"
                                                : "password"}
                                            variant="bordered"
                                            value={nuevaPassword}
                                            onValueChange={setNuevaPassword}
                                            isInvalid={isNuevaPasswordInvalid}
                                            errorMessage="La contraseña debe tener al menos 8 caracteres"
                                            isRequired
                                            endContent={
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setVerPassword(
                                                            !verPassword,
                                                        )}
                                                    className="focus:outline-none"
                                                    aria-label="Mostrar u ocultar contraseña"
                                                >
                                                    {verPassword
                                                        ? (
                                                            <EyeOff className="w-5 h-5 text-default-400" />
                                                        )
                                                        : (
                                                            <Eye className="w-5 h-5 text-default-400" />
                                                        )}
                                                </button>
                                            }
                                        />
                                        <Input
                                            label="Repetir contraseña"
                                            labelPlacement="outside"
                                            placeholder="Confirma tu contraseña"
                                            type={verRepetirPassword
                                                ? "text"
                                                : "password"}
                                            variant="bordered"
                                            value={repetirPassword}
                                            onValueChange={setRepetirPassword}
                                            isInvalid={isRepetirPasswordInvalid}
                                            errorMessage="La contraseña debe tener al menos 8 caracteres"
                                            isRequired
                                            endContent={
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setVerRepetirPassword(
                                                            !verRepetirPassword,
                                                        )}
                                                    className="focus:outline-none"
                                                    aria-label="Mostrar u ocultar contraseña"
                                                >
                                                    {verRepetirPassword
                                                        ? (
                                                            <EyeOff className="w-5 h-5 text-default-400" />
                                                        )
                                                        : (
                                                            <Eye className="w-5 h-5 text-default-400" />
                                                        )}
                                                </button>
                                            }
                                        />
                                        <Button
                                            type="button"
                                            color="primary"
                                            className="w-full"
                                            onClick={handleCambiarPassword}
                                        >
                                            Cambiar contraseña
                                        </Button>
                                    </>
                                )}
                        </CardBody>
                    </Card>
                </form>
            </section>
        </DefaultLayout>
    );
}
