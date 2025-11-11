/**import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrarCurso = async (req: Request, res: Response) => {
  try {
    const { idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso } = req.body;

    console.log(idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso);

    const nuevoCurso = await prisma.curso.create({
      data: {
      id_creador: idUsuario,
      titulo_curso: tituloCurso,
      slug: "el cursito",
      descripcion: descripcion,
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      publicado: true,
      },
    });

    res.status(201).json({
      message: "Curso registrado exitosamente",
      curso: nuevoCurso,
    });
  } catch (error) {
    console.error("Error al registrar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};**/
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrarCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso } = req.body;

    console.log("📥 Datos recibidos:", idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso);

    if (!idUsuario || !fechaInicio || !fechaFin || !descripcion || !tituloCurso) {
      res.status(400).json({ error: "Faltan campos requeridos" });
      return;
    }

    const nuevoCurso = await prisma.curso.create({
      data: {
        id_creador: parseInt(idUsuario), // ✅ Convertir a número
        titulo_curso: tituloCurso,
        slug: "predeterminado", // genera slug dinámico
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
      orderBy: { id_curso: "desc" }, // ordena por más recientes
    });
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error al obtener los cursos" });
  }
};


