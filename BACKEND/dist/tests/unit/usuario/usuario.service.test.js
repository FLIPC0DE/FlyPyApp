"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_service_1 = require("@/services/usuario.service");
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
    };
    it("actualiza perfil correctamente", async () => {
        const res = await (0, usuario_service_1.updatePerfilService)(req);
        expect(res).toHaveProperty("success", true);
    });
    it("actualiza contraseña correctamente", async () => {
        const res = await (0, usuario_service_1.updatePasswordService)(req);
        expect(res).toHaveProperty("success", true);
    });
    it("devuelve dashboard según rol", async () => {
        const res = await (0, usuario_service_1.getDashboardService)(req);
        expect(res).toHaveProperty("contenido");
        expect(res.contenido.mensaje).toMatch(/Bienvenido administrador/);
    });
});
