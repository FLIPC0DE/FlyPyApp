// routes/curso.routes.js
import { Router } from "express";
import {
  crearCurso,
  listarCursos,
  obtenerCurso,
  actualizarCurso,
  eliminarCurso,
} from "../controllers/curso.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const router = Router();

// Listar todos los cursos
router.get("/", listarCursos);

// Obtener detalle de un curso por ID
router.get("/:id", obtenerCurso);

// Crear un curso
router.post("/", authenticate, crearCurso);

// Actualizar un curso
router.put("/:id", authenticate, actualizarCurso);

// Eliminar un curso
router.delete("/:id", authenticate, eliminarCurso);

export default router;
