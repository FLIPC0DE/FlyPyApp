import express from "express";
import { registrarUsuario} from "../controllers/registroUsuario.controller.js";

const router = express.Router();

// POST /api/auth/registrarUsuario
router.post("/registrarUsuario", registrarUsuario);

export default router;
