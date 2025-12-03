import {
  enviarCodigoRecuperacionService,
  validarCodigoRecuperacionService,
  cambiarPasswordRecuperacionService,
} from "@/services/auth.service";
import { prisma } from "@/lib/prisma";
import { sendPasswordRecoveryEmail } from "@/lib/mailer";
import bcrypt from "bcrypt";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    verificationCode: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/mailer", () => ({
  sendPasswordRecoveryEmail: jest.fn().mockResolvedValue(true),
}));

describe("auth.service.ts", () => {
  const email = "pyfly.soporte@gmail.com";

  it("envía código de recuperación si el usuario existe", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ email });

    const res = await enviarCodigoRecuperacionService({ email });
    expect(res).toHaveProperty("mensaje");
    expect(sendPasswordRecoveryEmail).toHaveBeenCalled();
  });

  it("valida código correctamente", async () => {
    (prisma.verificationCode.findFirst as jest.Mock).mockResolvedValue({
      id_code: 1,
      code: "123456",
      consumed: false,
      expiresAt: new Date(Date.now() + 10000),
    });

    const res = await validarCodigoRecuperacionService({ email, codigo: "123456" });
    expect(res).toHaveProperty("mensaje");
    expect(prisma.verificationCode.update).toHaveBeenCalled();
  });

  it("cambia contraseña si el usuario existe", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ email });
    (prisma.usuario.update as jest.Mock).mockResolvedValue({});

    const res = await cambiarPasswordRecuperacionService({
      email,
      nuevaPassword: "NuevaClave123",
    });

    expect(res).toHaveProperty("mensaje");
  });
});
