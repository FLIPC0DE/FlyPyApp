"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.sendPasswordReset = exports.sendVerificationCode = void 0;
const mailer_service_1 = require("../services/mailer.service");
const sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Email inválido" });
    }
    try {
        await (0, mailer_service_1.sendVerificationCodeService)(email);
        return res.json({ success: true });
    }
    catch (err) {
        console.error("Error al enviar código de verificación:", err);
        return res.status(500).json({ error: "No se pudo enviar el correo" });
    }
};
exports.sendVerificationCode = sendVerificationCode;
// 🕳️ Placeholder para recuperación de contraseña
const sendPasswordReset = async (_req, res) => {
    return res.json({ message: "Función de recuperación aún no implementada" });
};
exports.sendPasswordReset = sendPasswordReset;
// 🕳️ Placeholder para notificaciones
const sendNotification = async (_req, res) => {
    return res.json({ message: "Función de notificación aún no implementada" });
};
exports.sendNotification = sendNotification;
