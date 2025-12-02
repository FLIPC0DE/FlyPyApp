import express from "express";
import { crearComentario, obtenerComentariosPorCurso } from "../controllers/comentario.controller";

const router = express.Router();

router.post("/crear", crearComentario);
router.get("/curso/:idCurso", obtenerComentariosPorCurso);

export default router;
