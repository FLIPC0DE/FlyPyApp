import {
    getDashboardService,
    getMetricasService,
    getPerfilService,
    getUsuariosService,
    updatePasswordService,
    updatePerfilService,
    updateRolService,
} from "../services/usuario.service.js";

const handleError = (res, error, contexto) => {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error(`❌ Error en ${contexto}:`, message);
    res.status(500).json({ error: message });
};

export const getUsuarios = async (req, res) => {
    try {
        const result = await getUsuariosService(req);
        res.json(result);
    } catch (error) {
        handleError(res, error, "getUsuarios");
    }
};

export const updateRol = async (req, res) => {
    try {
        const result = await updateRolService(req);
        res.json(result);
    } catch (error) {
        handleError(res, error, "updateRol");
    }
};

export const getPerfil = async (req, res) => {
    try {
        const result = await getPerfilService(req);
        res.json(result);
    } catch (error) {
        handleError(res, error, "getPerfil");
    }
};

export const updatePerfil = async (req, res) => {
    try {
        const result = await updatePerfilService(req);
        res.json(result);
    } catch (error) {
        handleError(res, error, "updatePerfil");
    }
};

export const updatePassword = async (req, res) => {
    try {
        const result = await updatePasswordService(req);
        res.json(result);
    } catch (error) {
        handleError(res, error, "updatePassword");
    }
};

export const getDashboard = async (req, res) => {
    try {
        const result = await getDashboardService(req);
        res.json(result);
    } catch (error) {
        handleError(res, error, "getDashboard");
    }
};

export const getMetricas = async (_req, res) => {
    try {
        const result = await getMetricasService();
        res.json(result);
    } catch (error) {
        handleError(res, error, "getMetricas");
    }
};
