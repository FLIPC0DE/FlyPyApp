import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generarSlug(titulo: string) {
  const base = titulo
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");

  const random = Math.random().toString(36).substring(2, 7);

  return `${base}-${random}`;
}

export const registrarCurso = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error("❌ Error al registrar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerCursos = async (_req: Request, res: Response) => {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: { id_curso: "asc" }, // ordena por más recientes
    });
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error al obtener los cursos" });
  }
};

export const obtenerCursosPublicados = async (_req: Request, res: Response) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: {
        publicado: true,
      },
      orderBy: { id_curso: "desc" }, // ordena por más recientes primero
      include: {
        creador: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
    });
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos publicados:", error);
    res.status(500).json({ error: "Error al obtener los cursos publicados" });
  }
};


