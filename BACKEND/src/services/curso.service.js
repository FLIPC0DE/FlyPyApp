// services/curso.service.js
import { prisma } from "../lib/prisma.js";
import slugify from "slugify";

/**
 * Crear un curso nuevo
 * @param {Object} data - Datos del curso
 * @param {number} id_creador - ID del usuario creador (desde req.user)
 * @returns {Promise<Object>} Curso creado
 */
export const createCurso = async (data, id_creador) => {
  // Validar que el usuario existe y tiene rol docente/admin
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id_creador },
    select: { id_usuario: true, rol_global: true }
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  if (
    !["DOCENTE_EDITOR", "DOCENTE_EJECUTOR", "ADMINISTRADOR", "ADMIN_AYUDANTE"].includes(
      usuario.rol_global
    )
  ) {
    throw new Error("No autorizado para crear cursos");
  }

  // Generar slug único a partir del título
  const slugBase = slugify(data.titulo_curso, { lower: true, strict: true });
  let slug = slugBase;
  let counter = 1;
  while (await prisma.curso.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  // Crear curso
  const curso = await prisma.curso.create({
    data: {
      titulo_curso: data.titulo_curso,
      descripcion: data.descripcion,
      fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : null,
      fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : null,
      id_creador,
      slug
    }
  });

  return curso;
};
