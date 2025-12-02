import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token" });
        }
        const token = auth.split(" ")[1];
        const payload = verifyToken(token);
        const userId = payload.userId;
        if (!userId) {
            return res.status(401).json({ error: "Token inválido" });
        }
        const user = await prisma.usuario.findUnique({
            where: { id_usuario: userId },
            select: {
                id_usuario: true,
                email: true,
                rol_global: true,
                id_rol: true,
            },
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
