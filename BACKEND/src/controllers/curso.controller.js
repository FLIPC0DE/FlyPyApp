// controllers/curso.controller.js
import {
  createCurso,
  getCursos,
  getCursoById,
  updateCurso,
  deleteCurso,
} from "../services/curso.service.js";
import slugify from "slugify";

/**
 * Crear curso
 * @route POST /api/cursos
 */

export const crearCurso = async (req, res) => {
  try {
    const { titulo_curso, descripcion, fecha_inicio, fecha_fin } = req.body;
    const id_creador = req.user?.id_usuario;

    if (!id_creador) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!titulo_curso) {
      return res.status(400).json({ error: "El título del curso es obligatorio" });
    }

    const slug = slugify(titulo_curso, {
      lower: true,
      strict: true,
    });

    const curso = await createCurso(
      { titulo_curso, descripcion, fecha_inicio, fecha_fin, slug },
      id_creador
    );

    return res.status(201).json({ message: "Curso creado exitosamente", curso });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Listar cursos
 * @route GET /api/cursos
 */
export const listarCursos = async (req, res) => {
  try {
    const cursos = await getCursos();
    return res.status(200).json(cursos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener detalle de curso
 * @route GET /api/cursos/:id
 */
export const obtenerCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await getCursoById(id);
    return res.status(200).json(curso);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

/**
 * Actualizar curso
 * @route PUT /api/cursos/:id
 */
export const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user?.id_usuario;
    const cursoActualizado = await updateCurso(id, req.body, id_usuario);
    return res.status(200).json({ message: "Curso actualizado", curso: cursoActualizado });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Eliminar curso
 * @route DELETE /api/cursos/:id
 */
export const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user?.id_usuario;
    const result = await deleteCurso(id, id_usuario);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
