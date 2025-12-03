import express from "express";
import { iniciarSesion } from "../controllers/autenticacion.controller.js";

const router = express.Router();

router.post("/iniciarSesion", iniciarSesion);

export default router;
