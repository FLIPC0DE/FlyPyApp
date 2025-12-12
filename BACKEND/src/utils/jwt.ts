// utils/jwt.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export const generateToken = (
  userId: number,
  rol_global?: string,
  nombre?: string,
  avatar_url?: string
) => {
  return jwt.sign(
    { userId, rol_global, nombre, avatar_url },
    SECRET,
    { expiresIn: "1h" }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as {
    userId?: number;
    nombre?: string;
    avatar_url?: string;
    rol_global?: string;
    iat?: number;
    exp?: number;
  };
};
