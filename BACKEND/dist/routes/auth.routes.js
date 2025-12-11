"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const register_validator_1 = require("../validators/register.validator");
const login_validator_1 = require("../validators/login.validator");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_middleware_1.validate)(register_validator_1.registerSchema), async (req, res) => {
    try {
        await (0, auth_controller_1.register)(req, res);
    }
    catch (err) {
        console.error("❌ Error en /register:", err.message);
        res.status(500).json({ error: "Error interno al registrar" });
    }
});
router.post("/login", (0, validate_middleware_1.validate)(login_validator_1.loginSchema), async (req, res) => {
    try {
        await (0, auth_controller_1.login)(req, res);
    }
    catch (err) {
        console.error("❌ Error en /login:", err.message);
        res.status(500).json({ error: "Error interno al iniciar sesión" });
    }
});
router.post("/logout", async (req, res) => {
    try {
        await (0, auth_controller_1.logout)(req, res);
    }
    catch (err) {
        console.error("❌ Error en /logout:", err.message);
        res.status(500).json({ error: "Error interno al cerrar sesión" });
    }
});
router.post("/recuperar", async (req, res) => {
    try {
        await (0, auth_controller_1.enviarCodigoRecuperacion)(req, res);
    }
    catch (err) {
        console.error("❌ Error en /recuperar:", err.message);
        res.status(500).json({ error: "Error interno al enviar código" });
    }
});
router.post("/recuperar/validar", async (req, res) => {
    try {
        await (0, auth_controller_1.validarCodigoRecuperacion)(req, res);
    }
    catch (err) {
        console.error("❌ Error en /recuperar/validar:", err.message);
        res.status(500).json({ error: "Error interno al validar código" });
    }
});
router.patch("/recuperar/cambiar", async (req, res) => {
    try {
        await (0, auth_controller_1.cambiarPasswordRecuperacion)(req, res);
    }
    catch (err) {
        console.error("❌ Error en /recuperar/cambiar:", err.message);
        res.status(500).json({ error: "Error interno al cambiar contraseña" });
    }
});
exports.default = router;
