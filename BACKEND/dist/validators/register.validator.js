"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(2, "Nombre muy corto"),
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "Password debe tener al menos 6 caracteres"),
});
