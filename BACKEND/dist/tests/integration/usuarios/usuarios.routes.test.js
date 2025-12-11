"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("@/lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const email = "pyfly.soporte@gmail.com";
beforeAll(async () => {
    await prisma_1.prisma.usuario.upsert({
        where: { email },
        update: {},
        create: {
            id_usuario: 1,
            email,
            nombre: "Admin FlyPy",
            password: await bcrypt_1.default.hash("12345678", 10),
            rol_global: "ADMINISTRADOR",
            id_rol: 1,
        },
    });
});
const token = jsonwebtoken_1.default.sign({ userId: 1, nombre: "Admin FlyPy", rol_global: "ADMINISTRADOR" }, process.env.JWT_SECRET || "dev-secret");
describe("Rutas de usuario", () => {
    describe("GET /api/usuarios/perfil", () => {
        it("debería devolver 401 si no hay token", async () => {
            const res = await (0, supertest_1.default)(server_1.default).get("/api/usuarios/perfil");
            expect(res.statusCode).toBe(401);
        });
        it("debería devolver el perfil con token válido", async () => {
            const res = await (0, supertest_1.default)(server_1.default)
                .get("/api/usuarios/perfil")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("perfil");
        });
    });
    describe("PATCH /api/usuarios/perfil", () => {
        it("debería actualizar el perfil con token válido", async () => {
            const res = await (0, supertest_1.default)(server_1.default)
                .patch("/api/usuarios/perfil")
                .set("Authorization", `Bearer ${token}`)
                .send({
                nombre: "Admin FlyPy",
                institucion: "UMSS",
                carrera: "Ingeniería de Sistemas",
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("perfil");
        });
    });
    describe("PATCH /api/usuarios/password", () => {
        it("debería cambiar la contraseña con token válido", async () => {
            const res = await (0, supertest_1.default)(server_1.default)
                .patch("/api/usuarios/password")
                .set("Authorization", `Bearer ${token}`)
                .send({ nuevaPassword: "NuevaClave123" });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("mensaje");
        });
    });
    describe("GET /api/usuarios/dashboard", () => {
        it("debería acceder al dashboard con token válido", async () => {
            const res = await (0, supertest_1.default)(server_1.default)
                .get("/api/usuarios/dashboard")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("mensaje");
        });
    });
    describe("PATCH /api/usuarios/rol", () => {
        it("debería asignar rol correctamente", async () => {
            const res = await (0, supertest_1.default)(server_1.default)
                .patch("/api/usuarios/rol")
                .set("Authorization", `Bearer ${token}`)
                .send({ rol_global: "ADMINISTRADOR" });
            expect(res.statusCode).toBe(200);
        });
    });
});
