import { Router } from "express";
import {
  sendVerificationCode,
  sendPasswordReset,
  sendNotification,
} from "../controllers/mailer.controller";

const router = Router();

router.post("/enviar", async (req, res) => {
  try {
    await sendVerificationCode(req, res);
  } catch (err: any) {
    console.error("❌ Error en POST /enviar:", err.message);
    res.status(500).json({ error: "Error al enviar código de verificación" });
  }
});

router.post("/recuperar", async (req, res) => {
  try {
    await sendPasswordReset(req, res);
  } catch (err: any) {
    console.error("❌ Error en POST /recuperar:", err.message);
    res.status(500).json({ error: "Error al enviar recuperación de contraseña" });
  }
});

router.post("/notificar", async (req, res) => {
  try {
    await sendNotification(req, res);
  } catch (err: any) {
    console.error("❌ Error en POST /notificar:", err.message);
    res.status(500).json({ error: "Error al enviar notificación" });
  }
});

export default router;
