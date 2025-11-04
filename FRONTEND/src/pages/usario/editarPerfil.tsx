import { useContext, useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { addToast, Button, Select, SelectItem } from "@heroui/react";
import { title } from "@/components/primitives";
import { AutenticacionContexto } from "@/context/autenticacionContexto";
import { apiRoutes } from "@/lib/api";

export default function EditarPerfilPage() {
    const { user, setUser } = useContext(AutenticacionContexto)!;
    const [loading, setLoading] = useState(true);
    const [perfilExtendido, setPerfilExtendido] = useState({
        institucion: "",
        carrera: "",
    });
    const [nombre, setNombre] = useState(user?.nombre ?? "");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(apiRoutes.usuarios.perfil, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setPerfilExtendido({
                    institucion: data?.institucion ?? "",
                    carrera: data?.carrera ?? "",
                });
                setLoading(false);
            })
            .catch(() => {
                addToast({
                    title: "Error",
                    description: "No se pudo cargar el perfil",
                    color: "danger",
                });
            });
    }, []);

    const handleGuardar = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const res = await fetch(apiRoutes.usuarios.actualizarPerfil, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nombre, ...perfilExtendido }),
            });

            if (res.ok) {
                addToast({
                    title: "Perfil actualizado ✅",
                    description: "Tus datos han sido guardados",
                    color: "success",
                });

                if (user?.userId !== undefined) {
                    setUser({
                        userId: user.userId,
                        nombre,
                        rol_global: user.rol_global ?? "",
                        avatar_url: user.avatar_url ?? "",
                        createdAt: user.createdAt ?? "",
                        iat: user.iat,
                        exp: user.exp,
                    });
                }
            } else {
                throw new Error();
            }
        } catch {
            addToast({
                title: "Error",
                description: "No se pudo actualizar el perfil",
                color: "danger",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-default-500 text-sm">Cargando datos...</p>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-6 py-8 md:py-10 max-w-xl mx-auto">
            <h1 className={title({ color: "primary" })}>Editar Perfil</h1>

            <Card>
                <CardBody className="flex flex-col gap-4">
                    <Input
                        label="Nombre"
                        value={nombre}
                        onValueChange={setNombre}
                    />
                    <Select
                        label="Institución"
                        isDisabled
                        defaultSelectedKeys={["umss"]}
                    >
                        <SelectItem key="umss">
                            Universidad Mayor de San Simón
                        </SelectItem>
                    </Select>
                    <Select
                        label="Carrera"
                        selectedKeys={[perfilExtendido.carrera]}
                        onSelectionChange={(keys) => {
                            const selected = String(Array.from(keys)[0]);
                            setPerfilExtendido((prev) => ({
                                ...prev,
                                carrera: selected,
                            }));
                        }}
                    >
                        <SelectItem key="ingenieria de sistemas">
                            Ingeniería de Sistemas
                        </SelectItem>
                        <SelectItem key="ingenieria en informatica">
                            Ingeniería en Informática
                        </SelectItem>
                    </Select>
                    <Button color="primary" onClick={handleGuardar}>
                        Guardar cambios
                    </Button>
                </CardBody>
            </Card>
        </section>
    );
}
