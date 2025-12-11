"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetricasService = exports.getDashboardService = exports.updatePasswordService = exports.updatePerfilService = exports.getPerfilService = exports.updateRolService = exports.getUsuariosService = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUsuariosService = async (req) => {
    const user = req.user;
    if (!["ADMINISTRADOR", "ADMIN_AYUDANTE"].includes(user?.rol_global ?? "")) {
        throw new Error("Acceso restringido a administradores");
    }
    return await prisma_1.prisma.usuario.findMany({
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
exports.getUsuariosService = getUsuariosService;
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
const updateRolService = async (req) => {
    const { rol_global } = req.body;
    const userId = req.user?.id_usuario;
    if (!rol_global || !Object.values(client_1.RolTipo).includes(rol_global)) {
        throw new Error("Rol no válido o no encontrado");
    }
    const rol = await prisma_1.prisma.rol.findUnique({ where: { tipo: rol_global } });
    if (!rol)
        throw new Error("Rol no encontrado en la base de datos");
    const usuarioActualizado = await prisma_1.prisma.usuario.update({
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
    const token = (0, jwt_1.generateToken)(usuarioActualizado.id_usuario, usuarioActualizado.rol_global ?? undefined, usuarioActualizado.nombre ?? undefined, usuarioActualizado.perfil?.avatar_url ?? undefined);
    return { user: usuarioActualizado, token };
};
exports.updateRolService = updateRolService;
const getPerfilService = async (req) => {
    const userId = req.user?.id_usuario;
    return await prisma_1.prisma.perfil.findUnique({ where: { id_usuario: userId } });
};
exports.getPerfilService = getPerfilService;
const updatePerfilService = async (req) => {
    const userId = req.user?.id_usuario;
    if (!userId)
        throw new Error("Usuario no autenticado");
    const { nombre, institucion, carrera } = req.body;
    await prisma_1.prisma.usuario.update({
        where: { id_usuario: userId },
        data: { nombre },
    });
    await prisma_1.prisma.perfil.upsert({
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
exports.updatePerfilService = updatePerfilService;
const updatePasswordService = async (req) => {
    const userId = req.user?.id_usuario;
    const { nuevaPassword } = req.body;
    const hashed = await bcrypt_1.default.hash(nuevaPassword, 10);
    await prisma_1.prisma.usuario.update({
        where: { id_usuario: userId },
        data: { password: hashed },
    });
    return { success: true };
};
exports.updatePasswordService = updatePasswordService;
const getDashboardService = async (req) => {
    const user = req.user;
    if (!user)
        throw new Error("No autenticado");
    const base = {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        rol_global: user.rol_global,
        id_rol: user.id_rol,
    };
    let contenido = {};
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
exports.getDashboardService = getDashboardService;
const getMetricasService = async () => {
    return { message: "Estas son tus métricas personales" };
};
exports.getMetricasService = getMetricasService;
