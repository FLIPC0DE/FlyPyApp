import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { requireGlobalRol, requireRol } from "../middlewares/requireRol.middleware";
import { getDashboard, getMetricas, getPerfil, getPerfilCompleto, getUsuarios, updatePassword, updatePerfil, updateRol } from "../controllers/usuario.controller";


const router = Router();

router.get("/", authenticate, requireGlobalRol(["ADMINISTRADOR", "ADMIN_AYUDANTE"]), async (req, res) => {
  try {
    await getUsuarios(req, res);
  } catch (err: any) {
    console.error("❌ Error en GET /usuarios:", err.message);
    res.status(500).json({ error: "Error interno al obtener usuarios" });
  }
});

router.patch("/rol", authenticate, async (req, res) => {
  try {
    await updateRol(req, res);
  } catch (err: any) {
    console.error("❌ Error en PATCH /rol:", err.message);
    res.status(500).json({ error: "Error interno al actualizar rol" });
  }
});

router.get("/perfil", authenticate, requireRol, async (req, res) => {
  try {
    await getPerfil(req, res);
  } catch (err: any) {
    console.error("❌ Error en GET /perfil:", err.message);
    res.status(500).json({ error: "Error interno al obtener perfil" });
  }
});

router.patch("/perfil", authenticate, async (req, res) => {
  try {
    await updatePerfil(req, res);
  } catch (err: any) {
    console.error("❌ Error en PATCH /perfil:", err.message);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

router.patch("/password", authenticate, async (req, res) => {
  try {
    await updatePassword(req, res);
  } catch (err: any) {
    console.error("❌ Error en PATCH /password:", err.message);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
});


router.get("/dashboard", authenticate, requireRol, async (req, res) => {
  try {
    await getDashboard(req, res);
  } catch (err: any) {
    console.error("❌ Error en GET /dashboard:", err.message);
    res.status(500).json({ error: "Error interno al obtener dashboard" });
  }
});

router.get("/metricas", authenticate, async (req, res) => {
  try {
    await getMetricas(req, res);
  } catch (err: any) {
    console.error("❌ Error en GET /metricas:", err.message);
    res.status(500).json({ error: "Error interno al obtener métricas" });
  }
});

router.get("/perfil-completo", authenticate, async (req, res) => {
  try {
    await getPerfilCompleto(req, res);
  } catch (err: any) {
    console.error("❌ Error en GET /perfil-completo:", err.message);
    res.status(500).json({ error: "Error interno al obtener perfil completo" });
  }
});

export default router;