"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
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
describe("Flujo completo: login → rol → dashboard", () => {
    it("debería iniciar sesión, asignar rol y acceder al dashboard", async () => {
        const loginRes = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({
            email: "pyfly.soporte@gmail.com",
            password: "12345678",
        });
        expect(loginRes.statusCode).toBe(200);
        const token = loginRes.body.token;
        expect(token).toBeDefined();
        const rolRes = await (0, supertest_1.default)(server_1.default)
            .patch("/api/usuarios/rol")
            .set("Authorization", `Bearer ${token}`)
            .send({ rol_global: "ADMINISTRADOR" });
        expect(rolRes.statusCode).toBe(200);
        const dashRes = await (0, supertest_1.default)(server_1.default)
            .get("/api/usuarios/dashboard")
            .set("Authorization", `Bearer ${token}`);
        expect(dashRes.statusCode).toBe(200);
        expect(dashRes.body).toHaveProperty("mensaje");
    });
});
