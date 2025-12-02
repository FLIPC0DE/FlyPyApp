import { Router } from "express";
import {
    sendNotification,
    sendPasswordReset,
    sendVerificationCode,
} from "../controllers/mailer.controller.js";

const router = Router();

router.post("/enviar", async (req, res) => {
    try {
        await sendVerificationCode(req, res);
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Error inesperado";
        console.error("❌ Error en POST /enviar:", message);
        res.status(500).json({ error: message });
    }
});

router.post("/recuperar", async (req, res) => {
    try {
        await sendPasswordReset(req, res);
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Error inesperado";
        console.error("❌ Error en POST /recuperar:", message);
        res.status(500).json({ error: message });
    }
});

router.post("/notificar", async (req, res) => {
    try {
        await sendNotification(req, res);
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Error inesperado";
        console.error("❌ Error en POST /notificar:", message);
        res.status(500).json({ error: message });
    }
});

export default router;
