import request from "supertest";
import app from "../../../server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

beforeAll(async () => {
  await prisma.usuario.upsert({
    where: { email: "pyfly.soporte@gmail.com" },
    update: {},
    create: {
      id_usuario: 1,
      email: "pyfly.soporte@gmail.com",
      nombre: "Admin FlyPy",
      password: await bcrypt.hash("12345678", 10),
      rol_global: "ADMINISTRADOR",
      id_rol: 1,
    },
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "pyfly.soporte@gmail.com",
    password: "12345678",
  });
});

describe("Rutas de autenticación", () => {
  describe("POST /api/auth/login", () => {
    it("debería fallar con credenciales incorrectas", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "pyfly.soporte@gmail.com",
        password: "incorrecta",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("debería cerrar sesión correctamente", async () => {
      const res = await request(app).post("/api/auth/logout");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Sesión cerrada");
    });
  });

  describe("POST /api/auth/recuperar", () => {
    it("debería fallar si el email es inválido", async () => {
      const res = await request(app).post("/api/auth/recuperar").send({
        email: "no-es-email",
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/recuperar/validar", () => {
    it("debería fallar si falta el código", async () => {
      const res = await request(app).post("/api/auth/recuperar/validar").send({
        email: "pyfly.soporte@gmail.com",
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("PATCH /api/auth/recuperar/cambiar", () => {
    it("debería fallar si el usuario no existe", async () => {
      const res = await request(app).patch("/api/auth/recuperar/cambiar").send({
        email: "noexiste@flypy.local",
        nuevaPassword: "ClaveSegura123",
      });
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
});
