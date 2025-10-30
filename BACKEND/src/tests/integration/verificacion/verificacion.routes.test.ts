import request from "supertest";
import app from "../../../server";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    verificationCode: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.spyOn(prisma.verificationCode, "findFirst").mockResolvedValue(null);

describe("Rutas de verificación", () => {
  const email = "pyfly.soporte@gmail.com";

  describe("POST /api/verificacion/enviar", () => {
    it("debería fallar si falta el email", async () => {
      const res = await request(app).post("/api/verificacion/enviar").send({});
      expect(res.statusCode).toBe(400);
    });

    it("debería fallar si el email es inválido", async () => {
      const res = await request(app).post("/api/verificacion/enviar").send({
        email: "no-es-email",
      });
      expect(res.statusCode).toBe(400);
    });

    it("debería enviar el código si el email es válido", async () => {
      (prisma.verificationCode.create as jest.Mock).mockResolvedValue({
        id_code: 1,
        code: "123456",
      });

      const res = await request(app).post("/api/verificacion/enviar").send({
        email,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true); // ajustado al controlador real
    });
  });

  describe("POST /api/verificacion/validar", () => {
    it("debería fallar si falta el código", async () => {
      const res = await request(app).post("/api/verificacion/validar").send({
        email,
      });
      expect(res.statusCode).toBe(400);
    });

    it("debería fallar si el código es incorrecto", async () => {
      (prisma.verificationCode.findFirst as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/api/verificacion/validar").send({
        email,
        codigo: "000000",
      });

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
});
