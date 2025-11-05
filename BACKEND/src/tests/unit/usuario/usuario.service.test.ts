import {
  updatePerfilService,
  updatePasswordService,
  getDashboardService,
} from "@/services/usuario.service";
import { AuthenticatedRequest } from "@/types/auth";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: {
      update: jest.fn(),
    },
    perfil: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("usuario.service.ts", () => {
  const req = {
    user: { id_usuario: 1, nombre: "Admin", rol_global: "ADMINISTRADOR", id_rol: 1 },
    body: {
      nombre: "Admin",
      institucion: "UMSS",
      carrera: "Ingeniería",
      nuevaPassword: "NuevaClave123",
    },
  } as unknown as AuthenticatedRequest;

  it("actualiza perfil correctamente", async () => {
    const res = await updatePerfilService(req);
    expect(res).toHaveProperty("success", true);
  });

  it("actualiza contraseña correctamente", async () => {
    const res = await updatePasswordService(req);
    expect(res).toHaveProperty("success", true);
  });

  it("devuelve dashboard según rol", async () => {
    const res = await getDashboardService(req);
    expect(res).toHaveProperty("contenido");
    expect(res.contenido.mensaje).toMatch(/Bienvenido administrador/);
  });
});
