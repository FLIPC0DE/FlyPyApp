import {
    cambiarPasswordRecuperacionService,
    enviarCodigoRecuperacionService,
    loginUser,
    registerUser,
    validarCodigoRecuperacionService,
} from "../services/auth.service.js";

const handleError = (res, error, contexto) => {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error(`❌ Error en ${contexto}:`, message);
    res.status(400).json({ error: message });
};

export const register = async (req, res) => {
    try {
        const result = await registerUser(req.body, req);
        return res.status(201).json(result); // ✅ incluye token, user, redirectTo
    } catch (error) {
        handleError(res, error, "registro");
    }
};

export const login = async (req, res) => {
    const result = await loginUser(req.body, req);
    res.status(200).json(result);
};

export const logout = (_req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Sesión cerrada" });
};

export const enviarCodigoRecuperacion = async (req, res) => {
    try {
        const result = await enviarCodigoRecuperacionService(req.body);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error, "/recuperar");
    }
};

export const validarCodigoRecuperacion = async (req, res) => {
    try {
        const result = await validarCodigoRecuperacionService(req.body);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error, "/recuperar/validar");
    }
};

export const cambiarPasswordRecuperacion = async (req, res) => {
    try {
        const result = await cambiarPasswordRecuperacionService(req.body);
        res.status(200).json(result);
    } catch (error) {
        handleError(res, error, "/recuperar/cambiar");
    }
};
