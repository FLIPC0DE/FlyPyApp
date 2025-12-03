import request from "supertest";
import app from "../../../server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const email = "pyfly.soporte@gmail.com";

beforeAll(async () => {
  await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      id_usuario: 1,
      email,
      nombre: "Admin FlyPy",
      password: await bcrypt.hash("12345678", 10),
      rol_global: "ADMINISTRADOR",
      id_rol: 1,
    },
  });
});

const token = jwt.sign(
  { userId: 1, nombre: "Admin FlyPy", rol_global: "ADMINISTRADOR" },
  process.env.JWT_SECRET || "dev-secret"
);

describe("Rutas de usuario", () => {
  describe("GET /api/usuarios/perfil", () => {
    it("debería devolver 401 si no hay token", async () => {
      const res = await request(app).get("/api/usuarios/perfil");
      expect(res.statusCode).toBe(401);
    });

    it("debería devolver el perfil con token válido", async () => {
      const res = await request(app)
        .get("/api/usuarios/perfil")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("perfil");
    });
  });

  describe("PATCH /api/usuarios/perfil", () => {
    it("debería actualizar el perfil con token válido", async () => {
      const res = await request(app)
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
      const res = await request(app)
        .patch("/api/usuarios/password")
        .set("Authorization", `Bearer ${token}`)
        .send({ nuevaPassword: "NuevaClave123" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("mensaje");
    });
  });

  describe("GET /api/usuarios/dashboard", () => {
    it("debería acceder al dashboard con token válido", async () => {
      const res = await request(app)
        .get("/api/usuarios/dashboard")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("mensaje");
    });
  });

  describe("PATCH /api/usuarios/rol", () => {
    it("debería asignar rol correctamente", async () => {
      const res = await request(app)
        .patch("/api/usuarios/rol")
        .set("Authorization", `Bearer ${token}`)
        .send({ rol_global: "ADMINISTRADOR" });

      expect(res.statusCode).toBe(200);
    });
  });
});
