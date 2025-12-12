"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_service_1 = require("@/services/mailer.service");
const prisma_1 = require("@/lib/prisma");
const mailer_1 = require("@/lib/mailer");
jest.mock("@/lib/prisma", () => ({
    prisma: {
        verificationCode: {
            create: jest.fn(),
        },
    },
}));
jest.mock("@/lib/mailer", () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(true),
}));
describe("mailer.service.ts", () => {
    it("envía código de verificación correctamente", async () => {
        const email = "pyfly.soporte@gmail.com";
        const res = await (0, mailer_service_1.sendVerificationCodeService)(email);
        expect(prisma_1.prisma.verificationCode.create).toHaveBeenCalled();
        expect(mailer_1.sendVerificationEmail).toHaveBeenCalledWith(email, expect.any(String));
    });
});
