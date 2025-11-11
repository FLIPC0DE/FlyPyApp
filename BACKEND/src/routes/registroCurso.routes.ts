import express from "express";
import { registrarCurso, obtenerCursos } from "../controllers/registroCurso.controller";

const router = express.Router();

router.post("/registrarCurso", registrarCurso);
router.get("/listarCursos", obtenerCursos); // 👈 Nueva ruta

export default router;