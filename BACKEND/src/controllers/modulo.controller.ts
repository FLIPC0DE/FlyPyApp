import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearModulo = async (req: Request, res: Response) => {
  try {
    const {id_curso, nombre} = req.body;

    if (!id_curso || !nombre) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const nuevoModulo = await prisma.modulo.create({
      data: {
        nombre : nombre,
        id_curso: Number(id_curso),
      },
    });

    res.status(201).json({
      message: "Modulo creado con exito ✅",
      modulo: nuevoModulo,
    });
  } catch (error) {
    console.error("Error al crear modulo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerModulosPorCurso = async (req: Request, res: Response) => {
  try {
    const { idCurso } = req.params;

    const modulos = await prisma.modulo.findMany({
      where: {
        id_curso: Number(idCurso),
      },
      select: {
        id_modulo: true,
        id_curso: true,
        nombre: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(modulos);
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarModulo = async (req: Request, res: Response) => {
  const { idModulo } = req.params;

  if (!idModulo) {
    return res.status(400).json({ error: "Falta el id del modulo" });
  }

  try {
    const id = parseInt(idModulo);

    // 1️⃣ Eliminar todos los contenidos asociados al tópico
    const topicos = await prisma.topico.findMany({
      where: { id_modulo: id }
    });
    
    for (const topico of topicos) {
      await prisma.contenido.deleteMany({
        where: { id_topico: topico.id_topico }
      });
    }

    for (const topico of topicos) {
      await prisma.topico.deleteMany({
        where: { id_topico: topico.id_topico }
      });
    }

    const eliminado = await prisma.modulo.delete({
      where: { id_modulo: id }
    });

    return res.json({
      ok: true,
      mensaje: "Modulo y contenido eliminado correctamente",
      moduloEliminado: eliminado
    });

  } catch (error) {
    console.error("Error al eliminar modulo:", error);
    return res.status(500).json({ error: "Error al eliminar modulo" });
  }
};

export const editarModulo = async (req: Request, res: Response) => {
  try {
    const { idModulo } = req.params;
    const { nombre } = req.body;

    if (!idModulo || !nombre) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const moduloActualizado = await prisma.modulo.update({
      where: {
        id_modulo: Number(idModulo),
      },
      data: {
        nombre: nombre,
      },
    });
    
    res.status(200).json({  
      message: "Módulo actualizado con éxito ✅",
      modulo: moduloActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar módulo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}