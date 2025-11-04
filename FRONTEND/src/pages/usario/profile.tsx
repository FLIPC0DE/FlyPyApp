// import { title } from "@/components/primitives";

// export default function ProfilePage() { // Cambia el nombre según la página
//   return (
//       <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//         <h1 className={title({ color: "primary" })}>Perfil</h1>
//         <p className="text-default-600">Página en construcción 🚧</p>
//       </section>
//   );
// }

import { useContext } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/react";
import { title } from "@/components/primitives";
import { AutenticacionContexto } from "@/context/autenticacionContexto";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useContext(AutenticacionContexto)!;
  const navigate = useNavigate();

  const fechaCreacion = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-BO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <section className="flex flex-col gap-6 py-8 md:py-10 max-w-xl mx-auto">
      <h1 className={title({ color: "primary" })}>Mi Perfil</h1>

      {fechaCreacion && (
        <p className="text-sm text-default-500 text-center">
          Cuenta creada el <strong>{fechaCreacion}</strong>
        </p>
      )}

      <Card>
        <CardBody className="flex flex-col gap-4 items-center">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt="Foto de perfil"
              className="rounded-full w-24 h-24 object-cover"
            />
          )}
          <p className="text-lg font-semibold">{user?.nombre}</p>
          <p className="text-sm text-default-500">{user?.rol_global}</p>
          <Button color="primary" onClick={() => navigate("/editar-perfil")}>
            Editar perfil
          </Button>
          <Button color="warning" onClick={() => navigate("/cambiar-contraseña")}>
            Cambiar contraseña
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}

