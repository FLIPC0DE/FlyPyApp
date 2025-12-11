"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerComentariosPorCurso = exports.crearComentario = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 🟢 Crear un nuevo comentario
const crearComentario = async (req, res) => {
    try {
        const { id_curso, id_usuario, contenido } = req.body;
        if (!id_usuario || !id_curso || !contenido) {
            return res.status(400).json({ error: "Faltan datos obligatorios." });
        }
        const nuevoComentario = await prisma.comentario.create({
            data: {
                contenido,
                id_usuario: Number(id_usuario),
                id_curso: Number(id_curso),
            },
        });
        res.status(201).json({
            message: "Comentario creado con éxito ✅",
            comentario: nuevoComentario,
        });
    }
    catch (error) {
        console.error("Error al crear comentario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.crearComentario = crearComentario;
// 🟡 Obtener todos los comentarios de un curso
const obtenerComentariosPorCurso = async (req, res) => {
    try {
        const { idCurso } = req.params;
        const comentarios = await prisma.comentario.findMany({
            where: {
                id_curso: Number(idCurso),
            },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                fecha: "desc",
            },
        });
        res.status(200).json(comentarios);
    }
    catch (error) {
        console.error("Error al obtener comentarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.obtenerComentariosPorCurso = obtenerComentariosPorCurso;
