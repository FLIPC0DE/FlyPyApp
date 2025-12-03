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