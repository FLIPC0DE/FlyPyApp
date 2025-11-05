import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";
import { AuthenticatedRequest } from "../types/auth.js";

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token" });
    }

    const token = auth.split(" ")[1];
    const payload = verifyToken(token) as {
      userId?: number;
      nombre?: string;
      avatar_url?: string;
      rol_global?: string;
    };

    const userId = payload.userId;
    if (!userId) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const user = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: { id_usuario: true, email: true, rol_global: true, id_rol: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = {
      id_usuario: user.id_usuario,
      email: user.email ?? undefined,
      rol_global: user.rol_global ?? null,
      id_rol: user.id_rol ?? null,
      nombre: payload.nombre,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};
