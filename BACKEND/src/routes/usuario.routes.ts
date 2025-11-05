import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { requireGlobalRol, requireRol } from "../middlewares/requireRol.middleware.js";
import {
  getDashboard,
  getMetricas,
  getPerfil,
  getUsuarios,
  updatePassword,
  updatePerfil,
  updateRol,
} from "../controllers/usuario.controller.js";

const router = Router();

router.get("/", authenticate, requireGlobalRol(["ADMINISTRADOR", "ADMIN_AYUDANTE"]), async (req, res) => {
  try {
    await getUsuarios(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en GET /usuarios:", message);
    res.status(500).json({ error: message });
  }
});

router.patch("/rol", authenticate, async (req, res) => {
  try {
    await updateRol(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en PATCH /rol:", message);
    res.status(500).json({ error: message });
  }
});

router.get("/perfil", authenticate, requireRol, async (req, res) => {
  try {
    await getPerfil(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en GET /perfil:", message);
    res.status(500).json({ error: message });
  }
});

router.patch("/perfil", authenticate, async (req, res) => {
  try {
    await updatePerfil(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en PATCH /perfil:", message);
    res.status(500).json({ error: message });
  }
});

router.patch("/password", authenticate, async (req, res) => {
  try {
    await updatePassword(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en PATCH /password:", message);
    res.status(500).json({ error: message });
  }
});

router.get("/dashboard", authenticate, requireRol, async (req, res) => {
  try {
    await getDashboard(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en GET /dashboard:", message);
    res.status(500).json({ error: message });
  }
});

router.get("/metricas", authenticate, async (req, res) => {
  try {
    await getMetricas(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en GET /metricas:", message);
    res.status(500).json({ error: message });
  }
});

export default router;
