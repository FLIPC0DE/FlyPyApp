import { prisma } from "@/lib/prisma";
import { sendPasswordRecoveryEmail } from "@/lib/mailer";
import { enviarCodigoRecuperacionService } from "../../../services/auth.service";

jest.mock("@/lib/mailer", () => ({
  sendPasswordRecoveryEmail: jest.fn().mockResolvedValue(true),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
    },
    verificationCode: {
      create: jest.fn(),
    },
  },
}));

describe("enviarCodigoRecuperacionService", () => {
  const email = "pyfly.soporte@gmail.com";

  it("debería lanzar error si el email es inválido", async () => {
    await expect(enviarCodigoRecuperacionService({ email: "invalid" }))
      .rejects.toThrow("Email inválido");
  });

  it("debería lanzar error si el usuario no existe", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(enviarCodigoRecuperacionService({ email: "noexiste@flypy.local" }))
      .rejects.toThrow("Email no registrado");
  });

  it("debería generar y enviar un código si el usuario existe", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
      id_usuario: 1,
      email,
      nombre: "Usuario de prueba",
    });

    (prisma.verificationCode.create as jest.Mock).mockResolvedValue({
      id_code: 1,
      code: "123456",
    });

    const result = await enviarCodigoRecuperacionService({ email });
    expect(result).toHaveProperty("mensaje");
    expect(sendPasswordRecoveryEmail).toHaveBeenCalledWith(
      email,
      expect.any(String)
    );
  });
});
