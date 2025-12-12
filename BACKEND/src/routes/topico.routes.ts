import { Router } from "express";
import { crearTopico, listarTopicosPorModulo, eliminarTopico, editarTopico} from "../controllers/topico.controller";

const router = Router();

router.post("/crear", crearTopico);
router.get("/listarTopicos/:idModulo", listarTopicosPorModulo);
router.delete("/eliminar/:idTopico", eliminarTopico);
router.put("/editar/:idTopico", editarTopico);

export default router;
