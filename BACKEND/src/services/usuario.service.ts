import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";
import { RolTipo } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";

export const getUsuariosService = async (req: AuthenticatedRequest) => {
  const user = req.user;
  if (!["ADMINISTRADOR", "ADMIN_AYUDANTE"].includes(user?.rol_global ?? "")) {
    throw new Error("Acceso restringido a administradores");
  }

  return await prisma.usuario.findMany({
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
      rol_global: true,
      id_rol: true,
      createdAt: true,
    },
  });
};

// export const updateRolService = async (req: AuthenticatedRequest) => {
//   const { rol_global } = req.body;
//   const userId = req.user?.id_usuario;

//   if (!rol_global || !Object.values(RolTipo).includes(rol_global)) {
//     throw new Error("Rol no válido o no encontrado");
//   }

//   const rol = await prisma.rol.findUnique({ where: { tipo: rol_global } });
//   if (!rol) throw new Error("Rol no encontrado en la base de datos");

//   return await prisma.usuario.update({
//     where: { id_usuario: userId },
//     data: {
//       rol_global,
//       id_rol: rol.id_rol,
//     },
//   });
// };

export const updateRolService = async (req: AuthenticatedRequest) => {
  const { rol_global } = req.body;
  const userId = req.user?.id_usuario;

  if (!rol_global || !Object.values(RolTipo).includes(rol_global)) {
    throw new Error("Rol no válido o no encontrado");
  }

  const rol = await prisma.rol.findUnique({ where: { tipo: rol_global } });
  if (!rol) throw new Error("Rol no encontrado en la base de datos");

  const usuarioActualizado = await prisma.usuario.update({
    where: { id_usuario: userId },
    data: {
      rol_global,
      id_rol: rol.id_rol,
    },
    include: {
      perfil: true,
      rol: true,
    },
  });

  const token = generateToken(
    usuarioActualizado.id_usuario,
    usuarioActualizado.rol_global ?? undefined,
    usuarioActualizado.nombre ?? undefined,
    usuarioActualizado.perfil?.avatar_url ?? undefined
  );

  return { user: usuarioActualizado, token };
};


export const getPerfilService = async (req: AuthenticatedRequest) => {
  const userId = req.user?.id_usuario;
  return await prisma.perfil.findUnique({ where: { id_usuario: userId } });
};

export const updatePerfilService = async (req: AuthenticatedRequest) => {
  const userId = req.user?.id_usuario;
  if (!userId) throw new Error("Usuario no autenticado");

  const { nombre, institucion, carrera } = req.body;

  await prisma.usuario.update({
    where: { id_usuario: userId },
    data: { nombre },
  });

  await prisma.perfil.upsert({
    where: { id_usuario: userId },
    update: { institucion, carrera },
    create: {
      id_usuario: userId,
      institucion,
      carrera,
    },
  });

  return { success: true };
};

export const updatePasswordService = async (req: AuthenticatedRequest) => {
  const userId = req.user?.id_usuario;
  const { nuevaPassword } = req.body;

  const hashed = await bcrypt.hash(nuevaPassword, 10);

  await prisma.usuario.update({
    where: { id_usuario: userId },
    data: { password: hashed },
  });

  return { success: true };
};

export const getDashboardService = async (req: AuthenticatedRequest) => {
  const user = req.user;
  if (!user) throw new Error("No autenticado");

  const base = {
    id_usuario: user.id_usuario,
    nombre: user.nombre,
    rol_global: user.rol_global,
    id_rol: user.id_rol,
  };

  type DashboardContenido = {
    mensaje: string;
    acciones: string[];
  };

  let contenido: DashboardContenido = { mensaje: "", acciones: [] };

  switch (user.rol_global) {
    case "ADMINISTRADOR":
      contenido = {
        mensaje: "Bienvenido administrador",
        acciones: ["ver usuarios", "gestionar cursos", "ver métricas globales"],
      };
      break;
    case "ADMIN_AYUDANTE":
      contenido = {
        mensaje: "Bienvenido ayudante",
        acciones: ["ver usuarios", "gestionar cursos"],
      };
      break;
    case "DOCENTE_EJECUTOR":
      contenido = {
        mensaje: "Bienvenido docente ejecutor",
        acciones: ["crear contenido", "ver inscripciones"],
      };
      break;
    case "DOCENTE_EDITOR":
      contenido = {
        mensaje: "Bienvenido docente editor",
        acciones: ["editar contenido"],
      };
      break;
    case "ESTUDIANTE":
      contenido = {
        mensaje: "Bienvenido estudiante",
        acciones: ["ver cursos", "ver progreso"],
      };
      break;
    default:
      contenido = {
        mensaje: "Rol no definido",
        acciones: [],
      };
  }

  return { ...base, contenido };
};

export const getMetricasService = async () => {
  return { message: "Estas son tus métricas personales" };
};
