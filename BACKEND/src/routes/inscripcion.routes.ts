import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  inscribirACurso,
  obtenerCursosInscritos,
  cancelarInscripcion,
  obtenerEstadoInscripcion,
} from "../controllers/inscripcion.controller";

const router = express.Router();

// Todas las rutas requieren autenticación
router.post("/inscribir", authenticate, inscribirACurso);
router.get("/mis-cursos", authenticate, obtenerCursosInscritos);
router.post("/cancelar", authenticate, cancelarInscripcion);
router.get("/estado/:id_curso", authenticate, obtenerEstadoInscripcion);

export default router;

