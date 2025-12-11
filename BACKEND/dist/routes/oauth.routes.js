"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oauth_controller_1 = require("../controllers/oauth.controller");
const oauth_service_1 = require("../services/oauth.service");
const router = (0, express_1.Router)();
router.get("/google", (req, res) => {
    try {
        const redirectUrl = (0, oauth_service_1.getOAuthRedirectUrl)("google");
        console.log("🔗 Redirigiendo a Google:", redirectUrl);
        res.redirect(redirectUrl);
    }
    catch (err) {
        console.error("❌ Error al generar URL de redirección:", err.message);
        res.status(500).json({ error: err.message });
    }
});
router.get("/google/callback", oauth_controller_1.googleCallback);
router.get("/microsoft", (req, res) => {
    try {
        const redirectUrl = (0, oauth_service_1.getOAuthRedirectUrl)("microsoft");
        console.log("🔗 Redirigiendo a Microsoft:", redirectUrl);
        res.redirect(redirectUrl);
    }
    catch (err) {
        console.error("❌ Error al generar URL de redirección:", err.message);
        res.status(500).json({ error: err.message });
    }
});
router.get("/microsoft/callback", oauth_controller_1.microsoftCallback);
router.get("/github", (req, res) => {
    try {
        const redirectUrl = (0, oauth_service_1.getOAuthRedirectUrl)("github");
        console.log("🔗 Redirigiendo a GitHub:", redirectUrl);
        res.redirect(redirectUrl);
    }
    catch (err) {
        console.error("❌ Error al generar URL de redirección:", err.message);
        res.status(500).json({ error: err.message });
    }
});
router.get("/github/callback", oauth_controller_1.githubCallback);
exports.default = router;
