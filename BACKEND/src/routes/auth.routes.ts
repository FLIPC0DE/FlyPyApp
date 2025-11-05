import { Router } from "express";
import {
  register,
  login,
  logout,
  validarCodigoRecuperacion,
  enviarCodigoRecuperacion,
  cambiarPasswordRecuperacion,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validators/register.validator";
import { loginSchema } from "../validators/login.validator";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    await register(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en /register:", message);
    res.status(500).json({ error: "Error interno al registrar" });
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    await login(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en /login:", message);
    res.status(500).json({ error: "Error interno al iniciar sesión" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    await logout(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en /logout:", message);
    res.status(500).json({ error: "Error interno al cerrar sesión" });
  }
});

router.post("/recuperar", async (req, res) => {
  try {
    await enviarCodigoRecuperacion(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en /recuperar:", message);
    res.status(500).json({ error: "Error interno al enviar código" });
  }
});

router.post("/recuperar/validar", async (req, res) => {
  try {
    await validarCodigoRecuperacion(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en /recuperar/validar:", message);
    res.status(500).json({ error: "Error interno al validar código" });
  }
});

router.patch("/recuperar/cambiar", async (req, res) => {
  try {
    await cambiarPasswordRecuperacion(req, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("❌ Error en /recuperar/cambiar:", message);
    res.status(500).json({ error: "Error interno al cambiar contraseña" });
  }
});

export default router;
