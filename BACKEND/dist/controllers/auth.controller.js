"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarPasswordRecuperacion = exports.validarCodigoRecuperacion = exports.enviarCodigoRecuperacion = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
// export const register = async (req: Request, res: Response) => {
//   const result = await registerUser(req.body, req);
//   res.status(201).json(result);
// };
const register = async (req, res) => {
    try {
        const result = await (0, auth_service_1.registerUser)(req.body, req);
        return res.status(201).json(result); // ✅ incluye token, user, redirectTo
    }
    catch (error) {
        console.error("Error en registro:", error);
        return res.status(400).json({ error: error.message || "Error al registrar" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const result = await (0, auth_service_1.loginUser)(req.body, req);
    res.status(200).json(result);
};
exports.login = login;
const logout = (_req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Sesión cerrada" });
};
exports.logout = logout;
const enviarCodigoRecuperacion = async (req, res) => {
    try {
        const result = await (0, auth_service_1.enviarCodigoRecuperacionService)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ Error en /recuperar:", error.message);
        res.status(400).json({ error: error.message || "Error al enviar código" });
    }
};
exports.enviarCodigoRecuperacion = enviarCodigoRecuperacion;
const validarCodigoRecuperacion = async (req, res) => {
    try {
        const result = await (0, auth_service_1.validarCodigoRecuperacionService)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ Error en /recuperar/validar:", error.message);
        res.status(400).json({ error: error.message || "Error al validar código" });
    }
};
exports.validarCodigoRecuperacion = validarCodigoRecuperacion;
const cambiarPasswordRecuperacion = async (req, res) => {
    try {
        const result = await (0, auth_service_1.cambiarPasswordRecuperacionService)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ Error en /recuperar/cambiar:", error.message);
        res.status(400).json({ error: error.message || "Error al cambiar contraseña" });
    }
};
exports.cambiarPasswordRecuperacion = cambiarPasswordRecuperacion;
