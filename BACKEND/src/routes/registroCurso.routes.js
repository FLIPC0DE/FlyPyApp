import express from "express";
import { registrarCurso} from "../controllers/registroCurso.controller.js";

const router = express.Router();

// POST /api/auth/registrarCurso
router.post("/registrarCurso", registrarCurso);

export default router;