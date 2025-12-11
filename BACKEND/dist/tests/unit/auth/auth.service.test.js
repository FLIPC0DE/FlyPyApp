"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("@/services/auth.service");
const prisma_1 = require("@/lib/prisma");
const mailer_1 = require("@/lib/mailer");
jest.mock("@/lib/prisma", () => ({
    prisma: {
        usuario: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        verificationCode: {
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    },
}));
jest.mock("@/lib/mailer", () => ({
    sendPasswordRecoveryEmail: jest.fn().mockResolvedValue(true),
}));
describe("auth.service.ts", () => {
    const email = "pyfly.soporte@gmail.com";
    it("envía código de recuperación si el usuario existe", async () => {
        prisma_1.prisma.usuario.findUnique.mockResolvedValue({ email });
        const res = await (0, auth_service_1.enviarCodigoRecuperacionService)({ email });
        expect(res).toHaveProperty("mensaje");
        expect(mailer_1.sendPasswordRecoveryEmail).toHaveBeenCalled();
    });
    it("valida código correctamente", async () => {
        prisma_1.prisma.verificationCode.findFirst.mockResolvedValue({
            id_code: 1,
            code: "123456",
            consumed: false,
            expiresAt: new Date(Date.now() + 10000),
        });
        const res = await (0, auth_service_1.validarCodigoRecuperacionService)({ email, codigo: "123456" });
        expect(res).toHaveProperty("mensaje");
        expect(prisma_1.prisma.verificationCode.update).toHaveBeenCalled();
    });
    it("cambia contraseña si el usuario existe", async () => {
        prisma_1.prisma.usuario.findUnique.mockResolvedValue({ email });
        prisma_1.prisma.usuario.update.mockResolvedValue({});
        const res = await (0, auth_service_1.cambiarPasswordRecuperacionService)({
            email,
            nuevaPassword: "NuevaClave123",
        });
        expect(res).toHaveProperty("mensaje");
    });
});
