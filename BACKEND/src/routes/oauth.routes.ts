import { Router } from "express";
import {
  googleCallback,
  microsoftCallback,
  githubCallback,
} from "../controllers/oauth.controller";
import { getOAuthRedirectUrl } from "../services/oauth.service";

const router = Router();

router.get("/google", (req, res) => {
  try {
    const redirectUrl = getOAuthRedirectUrl("google");
    console.log("🔗 Redirigiendo a Google:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err: any) {
    console.error("❌ Error al generar URL de redirección:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/google/callback", googleCallback);

router.get("/microsoft", (req, res) => {
  try {
    const redirectUrl = getOAuthRedirectUrl("microsoft");
    console.log("🔗 Redirigiendo a Microsoft:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err: any) {
    console.error("❌ Error al generar URL de redirección:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/microsoft/callback", microsoftCallback);

router.get("/github", (req, res) => {
  try {
    const redirectUrl = getOAuthRedirectUrl("github");
    console.log("🔗 Redirigiendo a GitHub:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err: any) {
    console.error("❌ Error al generar URL de redirección:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/github/callback", githubCallback);

export default router;