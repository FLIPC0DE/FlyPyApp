import { Router } from "express";
import {
    githubCallback,
    googleCallback,
    microsoftCallback,
} from "../controllers/oauth.controller.js";
import { getOAuthRedirectUrl } from "../services/oauth.service.js";

const router = Router();

router.get("/google", (req, res) => {
    try {
        const redirectUrl = getOAuthRedirectUrl("google");
        console.log("🔗 Redirigiendo a Google:", redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Error inesperado";
        console.error("❌ Error al generar URL de redirección:", message);
        res.status(500).json({ error: message });
    }
});

router.get("/google/callback", googleCallback);

router.get("/microsoft", (req, res) => {
    try {
        const redirectUrl = getOAuthRedirectUrl("microsoft");
        console.log("🔗 Redirigiendo a Microsoft:", redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Error inesperado";
        console.error("❌ Error al generar URL de redirección:", message);
        res.status(500).json({ error: message });
    }
});

router.get("/microsoft/callback", microsoftCallback);

router.get("/github", (req, res) => {
    try {
        const redirectUrl = getOAuthRedirectUrl("github");
        console.log("🔗 Redirigiendo a GitHub:", redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Error inesperado";
        console.error("❌ Error al generar URL de redirección:", message);
        res.status(500).json({ error: message });
    }
});

router.get("/github/callback", githubCallback);

export default router;
