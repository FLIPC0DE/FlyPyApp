import { Request, Response } from "express";
import { registerUser, loginUser, enviarCodigoRecuperacionService, validarCodigoRecuperacionService, cambiarPasswordRecuperacionService } from "../services/auth.service";

// export const register = async (req: Request, res: Response) => {
//   const result = await registerUser(req.body, req);
//   res.status(201).json(result);
// };
export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body, req);
    return res.status(201).json(result); // ✅ incluye token, user, redirectTo
  } catch (error: any) {
    console.error("Error en registro:", error);
    return res.status(400).json({ error: error.message || "Error al registrar" });
  }
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body, req);
  res.status(200).json(result);
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Sesión cerrada" });
};

export const enviarCodigoRecuperacion = async (req: Request, res: Response) => {
  try {
    const result = await enviarCodigoRecuperacionService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Error en /recuperar:", error.message);
    res.status(400).json({ error: error.message || "Error al enviar código" });
  }
};

export const validarCodigoRecuperacion = async (req: Request, res: Response) => {
  try {
    const result = await validarCodigoRecuperacionService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Error en /recuperar/validar:", error.message);
    res.status(400).json({ error: error.message || "Error al validar código" });
  }
};

export const cambiarPasswordRecuperacion = async (req: Request, res: Response) => {
  try {
    const result = await cambiarPasswordRecuperacionService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Error en /recuperar/cambiar:", error.message);
    res.status(400).json({ error: error.message || "Error al cambiar contraseña" });
  }
};
