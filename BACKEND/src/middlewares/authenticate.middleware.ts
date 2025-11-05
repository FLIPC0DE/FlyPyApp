import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest, AuthUser } from "../types/auth";

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });

    const token = auth.split(" ")[1];
    const payload = verifyToken(token) as Pick<AuthUser, "id_usuario">;
    const userId = payload.id_usuario;

    if (!userId) return res.status(401).json({ error: "Token inválido" });

    const user = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: { id_usuario: true, email: true, rol_global: true, id_rol: true },
    });

    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    req.user = {
      id_usuario: user.id_usuario,
      email: user.email ?? undefined,
      rol_global: user.rol_global ?? null,
      id_rol: user.id_rol ?? null,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};
