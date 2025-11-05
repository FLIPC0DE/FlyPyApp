import request from "supertest";
import app from "../../server";
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

  await request(app).post("/api/auth/login").send({
    email: "pyfly.soporte@gmail.com",
    password: "12345678",
  });
});

describe("Flujo completo: login → rol → dashboard", () => {
  it("debería iniciar sesión, asignar rol y acceder al dashboard", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "pyfly.soporte@gmail.com",
      password: "12345678",
    });
    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const rolRes = await request(app)
      .patch("/api/usuarios/rol")
      .set("Authorization", `Bearer ${token}`)
      .send({ rol_global: "ADMINISTRADOR" });
    expect(rolRes.statusCode).toBe(200);

    const dashRes = await request(app)
      .get("/api/usuarios/dashboard")
      .set("Authorization", `Bearer ${token}`);
    expect(dashRes.statusCode).toBe(200);
    expect(dashRes.body).toHaveProperty("mensaje");
  });
});
