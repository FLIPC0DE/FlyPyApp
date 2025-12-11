"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../server"));
const prisma_1 = require("@/lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
beforeAll(async () => {
    await prisma_1.prisma.usuario.upsert({
        where: { email: "pyfly.soporte@gmail.com" },
        update: {},
        create: {
            id_usuario: 1,
            email: "pyfly.soporte@gmail.com",
            nombre: "Admin FlyPy",
            password: await bcrypt_1.default.hash("12345678", 10),
            rol_global: "ADMINISTRADOR",
            id_rol: 1,
        },
    });
    const res = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({
        email: "pyfly.soporte@gmail.com",
        password: "12345678",
    });
});
describe("Rutas de autenticación", () => {
    describe("POST /api/auth/login", () => {
        it("debería fallar con credenciales incorrectas", async () => {
            const res = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({
                email: "pyfly.soporte@gmail.com",
                password: "incorrecta",
            });
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty("error");
        });
    });
    describe("POST /api/auth/logout", () => {
        it("debería cerrar sesión correctamente", async () => {
            const res = await (0, supertest_1.default)(server_1.default).post("/api/auth/logout");
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("message", "Sesión cerrada");
        });
    });
    describe("POST /api/auth/recuperar", () => {
        it("debería fallar si el email es inválido", async () => {
            const res = await (0, supertest_1.default)(server_1.default).post("/api/auth/recuperar").send({
                email: "no-es-email",
            });
            expect(res.statusCode).toBe(400);
        });
    });
    describe("POST /api/auth/recuperar/validar", () => {
        it("debería fallar si falta el código", async () => {
            const res = await (0, supertest_1.default)(server_1.default).post("/api/auth/recuperar/validar").send({
                email: "pyfly.soporte@gmail.com",
            });
            expect(res.statusCode).toBe(400);
        });
    });
    describe("PATCH /api/auth/recuperar/cambiar", () => {
        it("debería fallar si el usuario no existe", async () => {
            const res = await (0, supertest_1.default)(server_1.default).patch("/api/auth/recuperar/cambiar").send({
                email: "noexiste@flypy.local",
                nuevaPassword: "ClaveSegura123",
            });
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });
    });
});
