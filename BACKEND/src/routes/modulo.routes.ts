import express from "express";
import { crearModulo, obtenerModulosPorCurso, eliminarModulo, editarModulo } from "../controllers/modulo.controller";

const router = express.Router();

router.post("/crear", crearModulo);
router.get("/listarModulos/:idCurso", obtenerModulosPorCurso);
router.delete("/eliminar/:idModulo", eliminarModulo);
router.put("/editar/:idModulo", editarModulo); 

export default router;
