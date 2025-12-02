// services/curso.service.js
import { prisma } from "../lib/prisma.js";
import slugify from "slugify";

/**
 * Crear un curso nuevo
 */
export const createCurso = async (data, id_creador) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id_creador },
    select: { id_usuario: true, rol_global: true },
  });

  if (!usuario) throw new Error("Usuario no encontrado");

  if (
    !["DOCENTE_EDITOR", "DOCENTE_EJECUTOR", "ADMINISTRADOR", "ADMIN_AYUDANTE"]
      .includes(
        usuario.rol_global,
      )
  ) {
    throw new Error("No autorizado para crear cursos");
  }

  const slugBase = slugify(data.titulo_curso, { lower: true, strict: true });
  let slug = slugBase;
  let counter = 1;
  while (await prisma.curso.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${counter++}`;
  }

  return prisma.curso.create({
    data: {
      titulo_curso: data.titulo_curso,
      descripcion: data.descripcion,
      fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : null,
      fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : null,
      id_creador,
      slug,
    },
  });
};

/**
 * Listar todos los cursos
 */
export const getCursos = async () => {
  return prisma.curso.findMany({
    select: {
      id_curso: true,
      titulo_curso: true,
      descripcion: true,
      fecha_inicio: true,
      fecha_fin: true,
      slug: true,
      creador: {
        select: {
          id_usuario: true,
          nombre: true,
          email: true,
          perfil: { select: { avatar_url: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Obtener detalle de un curso por ID
 */
export const getCursoById = async (id_curso) => {
  const curso = await prisma.curso.findUnique({
    where: { id_curso: Number(id_curso) },
    include: {
      creador: { select: { id_usuario: true, nombre: true, email: true } },
      topicos: true,
      inscripciones: true,
      colaboradores: true,
    },
  });

  if (!curso) throw new Error("Curso no encontrado");
  return curso;
};

/**
 * Actualizar curso
 */
export const updateCurso = async (id_curso, data, id_usuario) => {
  const curso = await prisma.curso.findUnique({
    where: { id_curso: Number(id_curso) },
  });
  if (!curso) throw new Error("Curso no encontrado");

  if (curso.id_creador !== id_usuario) {
    throw new Error("No autorizado para editar este curso");
  }

  return prisma.curso.update({
    where: { id_curso: Number(id_curso) },
    data: {
      titulo_curso: data.titulo_curso ?? curso.titulo_curso,
      descripcion: data.descripcion ?? curso.descripcion,
      fecha_inicio: data.fecha_inicio
        ? new Date(data.fecha_inicio)
        : curso.fecha_inicio,
      fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : curso.fecha_fin,
      estado: data.estado ?? curso.estado,
    },
  });
};

/**
 * Eliminar curso
 */
export const deleteCurso = async (id_curso, id_usuario) => {
  const curso = await prisma.curso.findUnique({
    where: { id_curso: Number(id_curso) },
  });
  if (!curso) throw new Error("Curso no encontrado");

  if (curso.id_creador !== id_usuario) {
    throw new Error("No autorizado para eliminar este curso");
  }

  await prisma.curso.delete({ where: { id_curso: Number(id_curso) } });
  return { message: "Curso eliminado exitosamente" };
};
