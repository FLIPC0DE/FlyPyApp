import { Request, Response } from "express";
import {
  getUsuariosService,
  updateRolService,
  getPerfilService,
  getDashboardService,
  getMetricasService,
  updatePerfilService,
  updatePasswordService,
} from "../services/usuario.service";

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const result = await getUsuariosService(req);
    res.json(result);
  } catch (err: any) {
    console.error("❌ Error en getUsuarios:", err.message);
    res.status(500).json({ error: err.message || "Error al obtener usuarios" });
  }
};

export const updateRol = async (req: Request, res: Response) => {
  try {
    const result = await updateRolService(req);
    res.json(result);
  } catch (err: any) {
    console.error("❌ Error en updateRol:", err.message);
    res.status(500).json({ error: err.message || "Error al actualizar rol" });
  }
};

export const getPerfil = async (req: Request, res: Response) => {
  try {
    const result = await getPerfilService(req);
    res.json(result);
  } catch (err: any) {
    console.error("❌ Error en getPerfil:", err.message);
    res.status(500).json({ error: err.message || "Error al obtener perfil" });
  }
};

export const updatePerfil = async (req: Request, res: Response) => {
  try {
    const result = await updatePerfilService(req);
    res.json(result);
  } catch (err: any) {
    console.error("❌ Error en updatePerfil:", err.message);
    res.status(500).json({ error: err.message || "Error al actualizar perfil" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const result = await updatePasswordService(req);
    res.json(result);
  } catch (err: any) {
    console.error("❌ Error en updatePassword:", err.message);
    res.status(500).json({ error: err.message || "Error al actualizar contraseña" });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const result = await getDashboardService(req);
    res.json(result);
  } catch (err: any) {
    console.error("❌ Error en getDashboard:", err.message);
    res.status(500).json({ error: err.message || "Error al obtener dashboard" });
  }
};

export const getMetricas = async (_req: Request, res: Response) => {
  try {
    const result = await getMetricasService();
    res.json(result);
  } catch (err: any) {
    console.error("❌ Error en getMetricas:", err.message);
    res.status(500).json({ error: err.message || "Error al obtener métricas" });
  }
};
