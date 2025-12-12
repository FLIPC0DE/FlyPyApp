"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarSesion = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.usuario.findUnique({ where: { email } });
        // console.log(user.email,user.password);
        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });
        // console.log(user.email);
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword)
            return res.status(401).json({ message: "Contraseña incorrecta" });
        const token = jsonwebtoken_1.default.sign({ id: user.id_usuario, nombre: user.nombre, email: user.email, id_rol: user.id_rol }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login exitoso", token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.iniciarSesion = iniciarSesion;
