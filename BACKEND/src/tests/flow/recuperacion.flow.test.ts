import request from "supertest";
import app from "../../server";
import { prisma } from "@/lib/prisma";
import { sendPasswordRecoveryEmail } from "@/lib/mailer";
import bcrypt from "bcrypt";

jest.mock("@/lib/mailer", () => ({
  sendPasswordRecoveryEmail: jest.fn().mockResolvedValue(true),
}));

jest.spyOn(prisma.verificationCode, "create").mockResolvedValue({
  id_code: 1,
  email: "pyfly.soporte@gmail.com",
  code: "123456",
  purpose: "recovery",
  consumed: false,
  expiresAt: new Date(Date.now() + 600000),
  id_usuario: null,
  createdAt: new Date(),
});

jest.spyOn(prisma.verificationCode, "findFirst").mockResolvedValue({
  id_code: 1,
  email: "pyfly.soporte@gmail.com",
  code: "123456",
  purpose: "recovery",
  consumed: false,
  expiresAt: new Date(Date.now() + 600000),
  id_usuario: null,
  createdAt: new Date(),
});

beforeAll(async () => {
  await prisma.usuario.upsert({
    where: { email: "pyfly.soporte@gmail.com" },
    update: {},
    create: {
      id_usuario: 1,
      email: "pyfly.soporte@gmail.com",
      nombre: "Admin FlyPy",
      password: await bcrypt.hash("Admin#1234", 10),
      rol_global: "ADMINISTRADOR",
      id_rol: 1,
    },
  });
});

describe("Flujo completo de recuperación de contraseña", () => {
  const email = "pyfly.soporte@gmail.com";

  it("debería enviar un código de recuperación", async () => {
    const res = await request(app)
      .post("/api/auth/recuperar")
      .send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje");
    expect(sendPasswordRecoveryEmail).toHaveBeenCalledWith(
      email,
      expect.any(String)
    );
  });

  it("debería validar el código de recuperación", async () => {
    const codigo = await prisma.verificationCode.findFirst({
      where: {
        email,
        purpose: "recovery",
        consumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    expect(codigo).toBeTruthy();

    const res = await request(app)
      .post("/api/auth/recuperar/validar")
      .send({ email, codigo: codigo!.code });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje");
  });

  it("debería permitir cambiar la contraseña", async () => {
    const nuevaPassword = "NuevaClaveSegura123";

    const res = await request(app)
      .patch("/api/auth/recuperar/cambiar")
      .send({ email, nuevaPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje");

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    const match = await bcrypt.compare(nuevaPassword, usuario!.password!);
    expect(match).toBe(true);
  });
});
