"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../server"));
const prisma_1 = require("@/lib/prisma");
jest.mock("@/lib/prisma", () => ({
    prisma: {
        verificationCode: {
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    },
}));
jest.spyOn(prisma_1.prisma.verificationCode, "findFirst").mockResolvedValue(null);
describe("Rutas de verificación", () => {
    const email = "pyfly.soporte@gmail.com";
    describe("POST /api/verificacion/enviar", () => {
        it("debería fallar si falta el email", async () => {
            const res = await (0, supertest_1.default)(server_1.default).post("/api/verificacion/enviar").send({});
            expect(res.statusCode).toBe(400);
        });
        it("debería fallar si el email es inválido", async () => {
            const res = await (0, supertest_1.default)(server_1.default).post("/api/verificacion/enviar").send({
                email: "no-es-email",
            });
            expect(res.statusCode).toBe(400);
        });
        it("debería enviar el código si el email es válido", async () => {
            prisma_1.prisma.verificationCode.create.mockResolvedValue({
                id_code: 1,
                code: "123456",
            });
            const res = await (0, supertest_1.default)(server_1.default).post("/api/verificacion/enviar").send({
                email,
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("success", true); // ajustado al controlador real
        });
    });
    describe("POST /api/verificacion/validar", () => {
        it("debería fallar si falta el código", async () => {
            const res = await (0, supertest_1.default)(server_1.default).post("/api/verificacion/validar").send({
                email,
            });
            expect(res.statusCode).toBe(400);
        });
        it("debería fallar si el código es incorrecto", async () => {
            prisma_1.prisma.verificationCode.findFirst.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(server_1.default).post("/api/verificacion/validar").send({
                email,
                codigo: "000000",
            });
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });
    });
});
