import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";

/**
 * Inscribir un usuario a un curso
 */
export const inscribirACurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_curso } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id_usuario;

    // Validaciones
    if (!userId) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    if (!id_curso) {
      res.status(400).json({ error: "ID de curso requerido" });
      return;
    }

    const idCursoNumero = parseInt(String(id_curso));
    if (isNaN(idCursoNumero) || idCursoNumero <= 0) {
      res.status(400).json({ error: "ID de curso inválido" });
      return;
    }

    // Verificar que el curso existe y está publicado
    const curso = await prisma.curso.findUnique({
      where: { id_curso: idCursoNumero },
    });

    if (!curso) {
      res.status(404).json({ error: "Curso no encontrado" });
      return;
    }

    if (!curso.publicado) {
      res.status(400).json({ error: "El curso no está disponible para inscripción" });
      return;
    }

    // Verificar si ya existe una inscripción (activa o cancelada)
    const inscripcionExistente = await prisma.inscripcion.findUnique({
      where: {
        id_curso_id_usuario: {
          id_curso: idCursoNumero,
          id_usuario: userId,
        },
      },
    });

    let inscripcion;

    if (inscripcionExistente) {
      // Si ya existe una inscripción activa
      if (inscripcionExistente.estado === "active") {
        res.status(400).json({ error: "Ya estás inscrito en este curso" });
        return;
      }

      // Si la inscripción está cancelada, reactivarla
      if (inscripcionExistente.estado === "canceled") {
        inscripcion = await prisma.inscripcion.update({
          where: {
            id_inscripcion: inscripcionExistente.id_inscripcion,
          },
          data: {
            estado: "active",
            fecha_inscripcion: new Date(), // Actualizar fecha de reinscripción
          },
          include: {
            curso: {
              include: {
                creador: {
                  select: {
                    nombre: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        res.status(200).json({
          message: "✅ Reinscripción exitosa",
          inscripcion,
          esReinscripcion: true,
        });
        return;
      }
    }

    // Crear nueva inscripción si no existe ninguna
    inscripcion = await prisma.inscripcion.create({
      data: {
        id_curso: idCursoNumero,
        id_usuario: userId,
        estado: "active",
        progress: 0,
      },
      include: {
        curso: {
          include: {
            creador: {
              select: {
                nombre: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "✅ Inscripción exitosa",
      inscripcion,
      esReinscripcion: false,
    });
  } catch (error) {
    console.error("❌ Error al inscribir al curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtener cursos en los que el usuario está inscrito
 */
export const obtenerCursosInscritos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id_usuario;

    if (!userId) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const inscripciones = await prisma.inscripcion.findMany({
      where: {
        id_usuario: userId,
        estado: "active",
      },
      include: {
        curso: {
          include: {
            creador: {
              select: {
                nombre: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        fecha_inscripcion: "desc",
      },
    });

    // Formatear la respuesta
    const cursos = inscripciones.map((inscripcion) => ({
      ...inscripcion.curso,
      inscripcion: {
        id_inscripcion: inscripcion.id_inscripcion,
        fecha_inscripcion: inscripcion.fecha_inscripcion,
        progress: inscripcion.progress,
        estado: inscripcion.estado,
      },
    }));

    res.json(cursos);
  } catch (error) {
    console.error("❌ Error al obtener cursos inscritos:", error);
    res.status(500).json({ error: "Error al obtener los cursos inscritos" });
  }
};

/**
 * Cancelar inscripción a un curso
 */
export const cancelarInscripcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_curso } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id_usuario;

    // Validaciones
    if (!userId) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    if (!id_curso) {
      res.status(400).json({ error: "ID de curso requerido" });
      return;
    }

    const idCursoNumero = parseInt(String(id_curso));
    if (isNaN(idCursoNumero) || idCursoNumero <= 0) {
      res.status(400).json({ error: "ID de curso inválido" });
      return;
    }

    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        id_curso_id_usuario: {
          id_curso: idCursoNumero,
          id_usuario: userId,
        },
      },
    });

    if (!inscripcion) {
      res.status(404).json({ error: "No estás inscrito en este curso" });
      return;
    }

    await prisma.inscripcion.update({
      where: {
        id_inscripcion: inscripcion.id_inscripcion,
      },
      data: {
        estado: "canceled",
      },
    });

    res.json({ message: "Inscripción cancelada exitosamente" });
  } catch (error) {
    console.error("❌ Error al cancelar inscripción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtener el estado de inscripción de un usuario en un curso específico
 */
export const obtenerEstadoInscripcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_curso } = req.params;
    const userId = (req as AuthenticatedRequest).user?.id_usuario;

    // Validaciones
    if (!userId) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    if (!id_curso) {
      res.status(400).json({ error: "ID de curso requerido" });
      return;
    }

    const idCursoNumero = parseInt(String(id_curso));
    if (isNaN(idCursoNumero) || idCursoNumero <= 0) {
      res.status(400).json({ error: "ID de curso inválido" });
      return;
    }

    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        id_curso_id_usuario: {
          id_curso: idCursoNumero,
          id_usuario: userId,
        },
      },
    });

    if (!inscripcion) {
      res.json({
        inscrito: false,
        estado: null,
      });
      return;
    }

    res.json({
      inscrito: true,
      estado: inscripcion.estado,
      progress: inscripcion.progress,
      fecha_inscripcion: inscripcion.fecha_inscripcion,
    });
  } catch (error) {
    console.error("❌ Error al obtener estado de inscripción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

