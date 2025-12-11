"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetricas = exports.getDashboard = exports.updatePassword = exports.updatePerfil = exports.getPerfil = exports.updateRol = exports.getUsuarios = void 0;
const usuario_service_1 = require("../services/usuario.service");
const getUsuarios = async (req, res) => {
    try {
        const result = await (0, usuario_service_1.getUsuariosService)(req);
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error en getUsuarios:", err.message);
        res.status(500).json({ error: err.message || "Error al obtener usuarios" });
    }
};
exports.getUsuarios = getUsuarios;
const updateRol = async (req, res) => {
    try {
        const result = await (0, usuario_service_1.updateRolService)(req);
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error en updateRol:", err.message);
        res.status(500).json({ error: err.message || "Error al actualizar rol" });
    }
};
exports.updateRol = updateRol;
const getPerfil = async (req, res) => {
    try {
        const result = await (0, usuario_service_1.getPerfilService)(req);
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error en getPerfil:", err.message);
        res.status(500).json({ error: err.message || "Error al obtener perfil" });
    }
};
exports.getPerfil = getPerfil;
const updatePerfil = async (req, res) => {
    try {
        const result = await (0, usuario_service_1.updatePerfilService)(req);
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error en updatePerfil:", err.message);
        res.status(500).json({ error: err.message || "Error al actualizar perfil" });
    }
};
exports.updatePerfil = updatePerfil;
const updatePassword = async (req, res) => {
    try {
        const result = await (0, usuario_service_1.updatePasswordService)(req);
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error en updatePassword:", err.message);
        res.status(500).json({ error: err.message || "Error al actualizar contraseña" });
    }
};
exports.updatePassword = updatePassword;
const getDashboard = async (req, res) => {
    try {
        const result = await (0, usuario_service_1.getDashboardService)(req);
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error en getDashboard:", err.message);
        res.status(500).json({ error: err.message || "Error al obtener dashboard" });
    }
};
exports.getDashboard = getDashboard;
const getMetricas = async (_req, res) => {
    try {
        const result = await (0, usuario_service_1.getMetricasService)();
        res.json(result);
    }
    catch (err) {
        console.error("❌ Error en getMetricas:", err.message);
        res.status(500).json({ error: err.message || "Error al obtener métricas" });
    }
};
exports.getMetricas = getMetricas;
