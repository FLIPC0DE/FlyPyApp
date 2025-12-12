"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("@/lib/prisma");
const mailer_1 = require("@/lib/mailer");
const auth_service_1 = require("../../../services/auth.service");
jest.mock("@/lib/mailer", () => ({
    sendPasswordRecoveryEmail: jest.fn().mockResolvedValue(true),
}));
jest.mock("@/lib/prisma", () => ({
    prisma: {
        usuario: {
            findUnique: jest.fn(),
        },
        verificationCode: {
            create: jest.fn(),
        },
    },
}));
describe("enviarCodigoRecuperacionService", () => {
    const email = "pyfly.soporte@gmail.com";
    it("debería lanzar error si el email es inválido", async () => {
        await expect((0, auth_service_1.enviarCodigoRecuperacionService)({ email: "invalid" }))
            .rejects.toThrow("Email inválido");
    });
    it("debería lanzar error si el usuario no existe", async () => {
        prisma_1.prisma.usuario.findUnique.mockResolvedValue(null);
        await expect((0, auth_service_1.enviarCodigoRecuperacionService)({ email: "noexiste@flypy.local" }))
            .rejects.toThrow("Email no registrado");
    });
    it("debería generar y enviar un código si el usuario existe", async () => {
        prisma_1.prisma.usuario.findUnique.mockResolvedValue({
            id_usuario: 1,
            email,
            nombre: "Usuario de prueba",
        });
        prisma_1.prisma.verificationCode.create.mockResolvedValue({
            id_code: 1,
            code: "123456",
        });
        const result = await (0, auth_service_1.enviarCodigoRecuperacionService)({ email });
        expect(result).toHaveProperty("mensaje");
        expect(mailer_1.sendPasswordRecoveryEmail).toHaveBeenCalledWith(email, expect.any(String));
    });
});
