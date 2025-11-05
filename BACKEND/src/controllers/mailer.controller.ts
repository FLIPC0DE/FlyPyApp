import { Request, Response } from "express";
import {
  sendVerificationCodeService,
  // sendPasswordResetService,
  // sendNotificationService,
} from "../services/mailer.service";

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    await sendVerificationCodeService(email);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error al enviar código de verificación:", err);
    return res.status(500).json({ error: "No se pudo enviar el correo" });
  }
};

// 🕳️ Placeholder para recuperación de contraseña
export const sendPasswordReset = async (_req: Request, res: Response) => {
  return res.json({ message: "Función de recuperación aún no implementada" });
};

// 🕳️ Placeholder para notificaciones
export const sendNotification = async (_req: Request, res: Response) => {
  return res.json({ message: "Función de notificación aún no implementada" });
};
