"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerCursos = exports.registrarCurso = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function generarSlug(titulo) {
    const base = titulo
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-");
    const random = Math.random().toString(36).substring(2, 7);
    return `${base}-${random}`;
}
const registrarCurso = async (req, res) => {
    try {
        const { idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso } = req.body;
        const slugGenerado = generarSlug(tituloCurso);
        console.log("📥 Datos recibidos:", idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso);
        if (!idUsuario || !fechaInicio || !fechaFin || !descripcion || !tituloCurso) {
            res.status(400).json({ error: "Faltan campos requeridos" });
            return;
        }
        const nuevoCurso = await prisma.curso.create({
            data: {
                id_creador: parseInt(idUsuario), // ✅ Convertir a número
                titulo_curso: tituloCurso,
                slug: slugGenerado, // genera slug dinámico
                descripcion: descripcion,
                fecha_inicio: new Date(fechaInicio), // ✅ Usa fecha del formulario
                fecha_fin: new Date(fechaFin),
                publicado: true,
                estado: "activo",
            },
        });
        res.status(201).json({
            message: "✅ Curso registrado exitosamente",
            curso: nuevoCurso,
        });
    }
    catch (error) {
        console.error("❌ Error al registrar curso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.registrarCurso = registrarCurso;
const obtenerCursos = async (_req, res) => {
    try {
        const cursos = await prisma.curso.findMany({
            orderBy: { id_curso: "asc" }, // ordena por más recientes
        });
        res.json(cursos);
    }
    catch (error) {
        console.error("Error al obtener cursos:", error);
        res.status(500).json({ error: "Error al obtener los cursos" });
    }
};
exports.obtenerCursos = obtenerCursos;
