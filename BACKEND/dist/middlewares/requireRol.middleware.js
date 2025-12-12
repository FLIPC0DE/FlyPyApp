"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireGlobalRol = exports.requireRol = void 0;
// export const requireRol = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user) return res.status(401).json({ error: "No autenticado" });
//   const hasRole = !!req.user.rol_global || !!req.user.id_rol;
//   if (!hasRole) return res.status(403).json({ error: "Debes definir tu rol antes de continuar." });
//   next();
// };
const requireRol = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ error: "No autenticado" });
    const hasRole = !!req.user.rol_global || !!req.user.id_rol;
    if (!hasRole)
        return res.status(403).json({ error: "Debes definir tu rol antes de continuar." });
    next();
};
exports.requireRol = requireRol;
// middlewares/requireGlobalRol.ts
const requireGlobalRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const rol = req.user?.rol_global;
        if (!rol || !rolesPermitidos.includes(rol)) {
            return res.status(403).json({ error: "Acceso denegado por rol" });
        }
        next();
    };
};
exports.requireGlobalRol = requireGlobalRol;
