export const requireRol = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }
    const hasRole = !!req.user.rol_global || !!req.user.id_rol;
    if (!hasRole) {
        return res.status(403).json({
            error: "Debes definir tu rol antes de continuar.",
        });
    }
    next();
};

export const requireGlobalRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const rol = req.user?.rol_global;
        if (!rol || !rolesPermitidos.includes(rol)) {
            return res.status(403).json({ error: "Acceso denegado por rol" });
        }
        next();
    };
};
