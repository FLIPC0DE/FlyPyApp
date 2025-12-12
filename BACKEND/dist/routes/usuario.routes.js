"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const requireRol_middleware_1 = require("../middlewares/requireRol.middleware");
const usuario_controller_1 = require("../controllers/usuario.controller");
const router = (0, express_1.Router)();
router.get("/", authenticate_middleware_1.authenticate, (0, requireRol_middleware_1.requireGlobalRol)(["ADMINISTRADOR", "ADMIN_AYUDANTE"]), async (req, res) => {
    try {
        await (0, usuario_controller_1.getUsuarios)(req, res);
    }
    catch (err) {
        console.error("❌ Error en GET /usuarios:", err.message);
        res.status(500).json({ error: "Error interno al obtener usuarios" });
    }
});
router.patch("/rol", authenticate_middleware_1.authenticate, async (req, res) => {
    try {
        await (0, usuario_controller_1.updateRol)(req, res);
    }
    catch (err) {
        console.error("❌ Error en PATCH /rol:", err.message);
        res.status(500).json({ error: "Error interno al actualizar rol" });
    }
});
router.get("/perfil", authenticate_middleware_1.authenticate, requireRol_middleware_1.requireRol, async (req, res) => {
    try {
        await (0, usuario_controller_1.getPerfil)(req, res);
    }
    catch (err) {
        console.error("❌ Error en GET /perfil:", err.message);
        res.status(500).json({ error: "Error interno al obtener perfil" });
    }
});
router.patch("/perfil", authenticate_middleware_1.authenticate, async (req, res) => {
    try {
        await (0, usuario_controller_1.updatePerfil)(req, res);
    }
    catch (err) {
        console.error("❌ Error en PATCH /perfil:", err.message);
        res.status(500).json({ error: "Error al actualizar perfil" });
    }
});
router.patch("/password", authenticate_middleware_1.authenticate, async (req, res) => {
    try {
        await (0, usuario_controller_1.updatePassword)(req, res);
    }
    catch (err) {
        console.error("❌ Error en PATCH /password:", err.message);
        res.status(500).json({ error: "Error al actualizar contraseña" });
    }
});
router.get("/dashboard", authenticate_middleware_1.authenticate, requireRol_middleware_1.requireRol, async (req, res) => {
    try {
        await (0, usuario_controller_1.getDashboard)(req, res);
    }
    catch (err) {
        console.error("❌ Error en GET /dashboard:", err.message);
        res.status(500).json({ error: "Error interno al obtener dashboard" });
    }
});
router.get("/metricas", authenticate_middleware_1.authenticate, async (req, res) => {
    try {
        await (0, usuario_controller_1.getMetricas)(req, res);
    }
    catch (err) {
        console.error("❌ Error en GET /metricas:", err.message);
        res.status(500).json({ error: "Error interno al obtener métricas" });
    }
});
exports.default = router;
