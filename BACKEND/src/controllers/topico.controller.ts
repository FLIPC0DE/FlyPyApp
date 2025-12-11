import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tipos permitidos
const TIPOS_VALIDOS = [
  "TEXTO_IMAGEN",
  "TEXTO_VIDEO",
  "TEXTO_SLIDES",
  "TEXTO_AUDIO",
  "PLAYGROUND",
  "VIDEO_PLAYGROUND",
  "IMAGE_PLAYGROUND",
];

// --------------------- Crear tópico ---------------------
export const crearTopico = async (req: Request, res: Response) => {
  const {
    titulo,
    descripcion,
    tipo,
    disponible_desde,
    disponible_hasta,
    id_modulo,
    id_curso,
  } = req.body;

  // Validaciones básicas
  if (!titulo || !tipo || !id_modulo || !id_curso) {
    return res.status(400).json({
      success: false,
      error: "Faltan datos obligatorios.",
    });
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({
      success: false,
      error: `Tipo inválido. Valores permitidos: ${TIPOS_VALIDOS.join(", ")}`,
    });
  }

  try {
    // Buscar curso
    const curso = await prisma.curso.findUnique({
      where: { id_curso: Number(id_curso) },
    });

    if (!curso) {
      return res.status(400).json({
        success: false,
        error: "Curso no encontrado.",
      });
    }

    // No validamos fechas, solo convertimos o guardamos null
    const disponibleDesde =
      disponible_desde ? new Date(disponible_desde) : null;

    const disponibleHasta =
      disponible_hasta ? new Date(disponible_hasta) : null;

    // Crear tópico
    const topico = await prisma.topico.create({
      data: {
        titulo,
        descripcion: descripcion || null,
        tipo,
        disponibleDesde,
        disponibleHasta,
        id_modulo: Number(id_modulo),
        id_curso: Number(id_curso),
      },
    });

    return res.status(201).json({ success: true, data: topico });
  } catch (error) {
    console.error("Error al crear tópico:", error);
    return res.status(500).json({
      success: false,
      error: "Error al crear tópico.",
    });
  }
};

// --------------------- Listar tópicos por módulo ---------------------
export const listarTopicosPorModulo = async (req: Request, res: Response) => {
  const { idModulo } = req.params;

  if (!idModulo) return res.status(400).json({ error: "Falta el id del módulo" });

  try {
    const topicos = await prisma.topico.findMany({
      where: { id_modulo: parseInt(idModulo) },
      orderBy: { id_topico: "asc" },
    });

    return res.json(topicos);
  } catch (error) {
    console.error("Error al listar tópicos:", error);
    return res.status(500).json({ error: "Error al obtener tópicos" });
  }
};

export const eliminarTopico = async (req: Request, res: Response) => {
  const { idTopico } = req.params;

  if (!idTopico) {
    return res.status(400).json({ error: "Falta el id del topico" });
  }

  try {
    const id = parseInt(idTopico);

    // 1️⃣ Eliminar todos los contenidos asociados al tópico
    await prisma.contenido.deleteMany({
      where: { id_topico: id }
    });

    // 2️⃣ Eliminar el tópico
    const eliminado = await prisma.topico.delete({
      where: { id_topico: id }
    });

    return res.json({
      ok: true,
      mensaje: "Tópico y contenidos eliminados correctamente",
      topicoEliminado: eliminado
    });

  } catch (error) {
    console.error("Error al eliminar tópico:", error);
    return res.status(500).json({ error: "Error al eliminar tópico" });
  }
};

export const editarTopico = async (req: Request, res: Response) => {
  const { idTopico } = req.params;
  const {
    titulo,
    descripcion,
    disponible_desde,
    disponible_hasta,
  } = req.body;

  if (!idTopico) {
    return res.status(400).json({ error: "Falta el id del tópico" });
  }


  try {
    const id = parseInt(idTopico);

    const actualizado = await prisma.topico.update({
      where: { id_topico: id },
      data: {
        titulo,
        descripcion,
        disponibleDesde: disponible_desde ? new Date(disponible_desde) : null,
        disponibleHasta: disponible_hasta ? new Date(disponible_hasta) : null,
      },
    });

    return res.json({
      ok: true,
      mensaje: "Tópico actualizado correctamente",
      topicoActualizado: actualizado
    });

  } catch (error) {
    console.error("Error al editar tópico:", error);
    return res.status(500).json({ error: "Error al editar tópico" });
  }
}

