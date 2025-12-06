import express from "express";
import { registrarCurso, obtenerCursos, obtenerCursosPublicados } from "../controllers/registroCurso.controller";

const router = express.Router();

router.post("/registrarCurso", registrarCurso);
router.get("/listarCursos", obtenerCursos);
router.get("/publicados", obtenerCursosPublicados); // 👈 Nueva ruta para cursos publicados

export default router;