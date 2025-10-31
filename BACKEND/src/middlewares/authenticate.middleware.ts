// src/middlewares/authenticate.ts
import express from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../types/auth";

export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
    const token = auth.split(" ")[1];
    const payload = verifyToken(token);
    const userId = (payload as any).userId;
    if (!userId) return res.status(401).json({ error: "Token inválido" });

    const user = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: { id_usuario: true, email: true, rol_global: true, id_rol: true },
    });

    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

    // aquí hacemos la aserción de tipo para que TS acepte la propiedad user
    (req as AuthenticatedRequest).user = {
      id_usuario: user.id_usuario,
      email: user.email ?? undefined,
      rol_global: user.rol_global ?? null,
      id_rol: user.id_rol ?? null,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
