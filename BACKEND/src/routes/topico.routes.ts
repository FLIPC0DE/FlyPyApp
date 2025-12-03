import { Router } from "express";
import { crearTopico, listarTopicosPorModulo } from "../controllers/topico.controller";

const router = Router();

router.post("/crear", crearTopico);
router.get("/listarTopicos/:idModulo", listarTopicosPorModulo);

export default router;
