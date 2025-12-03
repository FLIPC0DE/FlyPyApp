import express from "express";
import { crearModulo, obtenerModulosPorCurso } from "../controllers/modulo.controller";

const router = express.Router();

router.post("/crear", crearModulo);
router.get("/listarModulos/:idCurso", obtenerModulosPorCurso);

export default router;
