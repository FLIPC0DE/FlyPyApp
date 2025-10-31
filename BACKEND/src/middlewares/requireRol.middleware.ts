// src/middlewares/requireRol.ts
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";

// export const requireRol = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user) return res.status(401).json({ error: "No autenticado" });
//   const hasRole = !!req.user.rol_global || !!req.user.id_rol;
//   if (!hasRole) return res.status(403).json({ error: "Debes definir tu rol antes de continuar." });
//   next();
// };

export const requireRol = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: "No autenticado" });
  const hasRole = !!req.user.rol_global || !!req.user.id_rol;
  if (!hasRole) return res.status(403).json({ error: "Debes definir tu rol antes de continuar." });
  next();
};


// middlewares/requireGlobalRol.ts
export const requireGlobalRol = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rol = (req as AuthenticatedRequest).user?.rol_global;
    if (!rol || !rolesPermitidos.includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado por rol" });
    }
    next();
  };
};
