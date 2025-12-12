"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_service_1 = require("../../../services/auth.service");
const prisma_1 = require("@/lib/prisma");
jest.mock("@/lib/prisma", () => ({
    prisma: {
        usuario: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));
describe("cambiarPasswordRecuperacionService", () => {
    const email = "pyfly.soporte@gmail.com";
    const nuevaPassword = "ClaveSegura123";
    it("debería lanzar error si los datos son inválidos", async () => {
        await expect((0, auth_service_1.cambiarPasswordRecuperacionService)({ email: "", nuevaPassword }))
            .rejects.toThrow("Datos inválidos");
    });
    it("debería lanzar error si el usuario no existe", async () => {
        prisma_1.prisma.usuario.findUnique.mockResolvedValue(null);
        await expect((0, auth_service_1.cambiarPasswordRecuperacionService)({
            email: "noexiste@flypy.local",
            nuevaPassword,
        })).rejects.toThrow("Usuario no encontrado");
    });
    it("debería actualizar la contraseña correctamente", async () => {
        const hashed = await bcrypt_1.default.hash("originalPassword123", 10);
        prisma_1.prisma.usuario.findUnique.mockResolvedValue({
            id_usuario: 1,
            email,
            password: hashed,
        });
        prisma_1.prisma.usuario.update.mockResolvedValue({
            id_usuario: 1,
            email,
            password: await bcrypt_1.default.hash(nuevaPassword, 10),
        });
        const result = await (0, auth_service_1.cambiarPasswordRecuperacionService)({ email, nuevaPassword });
        expect(result).toHaveProperty("mensaje");
    });
});
