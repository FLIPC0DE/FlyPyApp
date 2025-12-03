import { prisma } from "../../../lib/prisma";
import { validarCodigoRecuperacionService } from "../../../services/auth.service";

describe("validarCodigoRecuperacionService", () => {
  const email = "pyfly.soporte@gmail.com";

  it("debería lanzar error si faltan datos", async () => {
    await expect(validarCodigoRecuperacionService({ email, codigo: "" }))
      .rejects.toThrow("Faltan datos");
  });

  it("debería lanzar error si el código es inválido", async () => {
    await expect(validarCodigoRecuperacionService({ email, codigo: "000000" }))
      .rejects.toThrow("Código inválido o expirado");
  });

  it("debería validar el código correctamente", async () => {
    (prisma.verificationCode.findFirst as jest.Mock).mockResolvedValue({
      id_code: 1,
      email,
      code: "123456",
      purpose: "recovery",
      consumed: false,
      expiresAt: new Date(Date.now() + 1000 * 60),
    });

    const result = await validarCodigoRecuperacionService({
      email,
      codigo: "123456",
    });

    expect(result).toHaveProperty("mensaje");
  });
});
