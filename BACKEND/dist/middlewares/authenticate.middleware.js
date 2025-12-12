"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../lib/prisma");
const authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith("Bearer "))
            return res.status(401).json({ error: "No token" });
        const token = auth.split(" ")[1];
        const payload = (0, jwt_1.verifyToken)(token);
        const userId = payload.userId;
        if (!userId)
            return res.status(401).json({ error: "Token inválido" });
        const user = await prisma_1.prisma.usuario.findUnique({
            where: { id_usuario: userId },
            select: { id_usuario: true, email: true, rol_global: true, id_rol: true },
        });
        if (!user)
            return res.status(401).json({ error: "Usuario no encontrado" });
        // aquí hacemos la aserción de tipo para que TS acepte la propiedad user
        req.user = {
            id_usuario: user.id_usuario,
            email: user.email ?? undefined,
            rol_global: user.rol_global ?? null,
            id_rol: user.id_rol ?? null,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
};
exports.authenticate = authenticate;
