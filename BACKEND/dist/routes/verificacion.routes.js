"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailer_controller_1 = require("../controllers/mailer.controller");
const router = (0, express_1.Router)();
router.post("/enviar", async (req, res) => {
    try {
        await (0, mailer_controller_1.sendVerificationCode)(req, res);
    }
    catch (err) {
        console.error("❌ Error en POST /enviar:", err.message);
        res.status(500).json({ error: "Error al enviar código de verificación" });
    }
});
router.post("/recuperar", async (req, res) => {
    try {
        await (0, mailer_controller_1.sendPasswordReset)(req, res);
    }
    catch (err) {
        console.error("❌ Error en POST /recuperar:", err.message);
        res.status(500).json({ error: "Error al enviar recuperación de contraseña" });
    }
});
router.post("/notificar", async (req, res) => {
    try {
        await (0, mailer_controller_1.sendNotification)(req, res);
    }
    catch (err) {
        console.error("❌ Error en POST /notificar:", err.message);
        res.status(500).json({ error: "Error al enviar notificación" });
    }
});
exports.default = router;
