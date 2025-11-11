import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 Crear un nuevo comentario
export const crearComentario = async (req: Request, res: Response) => {
  try {
    const { usuarioId, cursoId, contenido } = req.body;

    if (!usuarioId || !cursoId || !contenido) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const nuevoComentario = await prisma.comentario.create({
      data: {
        contenido,
        usuarioId: Number(usuarioId),
        cursoId: Number(cursoId),
      },
    });

    res.status(201).json({
      message: "Comentario creado con éxito ✅",
      comentario: nuevoComentario,
    });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🟡 Obtener todos los comentarios de un curso
export const obtenerComentariosPorCurso = async (req: Request, res: Response) => {
  try {
    const { idCurso } = req.params;

    const comentarios = await prisma.comentario.findMany({
      where: {
        cursoId: Number(idCurso),
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
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
