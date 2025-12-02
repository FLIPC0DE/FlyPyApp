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

  // Validaciones
  if (!titulo || !tipo || !id_modulo || !id_curso) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ error: `Tipo inválido. Valores permitidos: ${TIPOS_VALIDOS.join(", ")}` });
  }

  try {
    const topico = await prisma.topico.create({
      data: {
        titulo,
        descripcion: descripcion || null,
        tipo,
        disponibleDesde: disponible_desde ? new Date(disponible_desde) : null,
        disponibleHasta: disponible_hasta ? new Date(disponible_hasta) : null,
        id_modulo: parseInt(id_modulo),
        id_curso: parseInt(id_curso),
      },
    });

    return res.status(201).json(topico);
  } catch (error) {
    console.error("Error al crear tópico:", error);
    return res.status(500).json({ error: "Error al crear tópico" });
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
