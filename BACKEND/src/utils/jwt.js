// utils/jwt.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export const generateToken = (userId, rol_global, nombre, avatar_url) => {
    return jwt.sign({ userId, rol_global, nombre, avatar_url }, SECRET, {
        expiresIn: "8h",
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
