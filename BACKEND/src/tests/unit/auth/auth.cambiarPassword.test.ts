import bcrypt from "bcrypt";
import { cambiarPasswordRecuperacionService } from "../../../services/auth.service";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("cambiarPasswordRecuperacionService", () => {
  const email = "pyfly.soporte@gmail.com";
  const nuevaPassword = "ClaveSegura123";

  it("debería lanzar error si los datos son inválidos", async () => {
    await expect(cambiarPasswordRecuperacionService({ email: "", nuevaPassword }))
      .rejects.toThrow("Datos inválidos");
  });

  it("debería lanzar error si el usuario no existe", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(cambiarPasswordRecuperacionService({
      email: "noexiste@flypy.local",
      nuevaPassword,
    })).rejects.toThrow("Usuario no encontrado");
  });

  it("debería actualizar la contraseña correctamente", async () => {
    const hashed = await bcrypt.hash("originalPassword123", 10);

    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
      id_usuario: 1,
      email,
      password: hashed,
    });

    (prisma.usuario.update as jest.Mock).mockResolvedValue({
      id_usuario: 1,
      email,
      password: await bcrypt.hash(nuevaPassword, 10),
    });

    const result = await cambiarPasswordRecuperacionService({ email, nuevaPassword });
    expect(result).toHaveProperty("mensaje");
  });
});
