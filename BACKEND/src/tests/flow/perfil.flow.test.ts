import request from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// beforeAll(async () => {
//   await prisma.usuario.upsert({
//     where: { email: "pyfly.soporte@gmail.com" },
//     update: {},
//     create: {
//       id_usuario: 1,
//       email: "pyfly.soporte@gmail.com",
//       nombre: "Admin FlyPy",
//       password: await bcrypt.hash("12345678", 10),
//       rol_global: "ADMINISTRADOR",
//       id_rol: 1,
//     },
//   });
// });

// const token = jwt.sign(
//   {
//     userId: 1,
//     nombre: "Admin FlyPy",
//     rol_global: "ADMINISTRADOR",
//   },
//   process.env.JWT_SECRET || "dev-secret"
// );

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
});

const token = jwt.sign(
  { userId: 1, nombre: "Admin FlyPy", rol_global: "ADMINISTRADOR" },
  process.env.JWT_SECRET || "dev-secret"
);


const headers = {
  Authorization: `Bearer ${token}`,
};

describe("Flujo completo: editar perfil → ver perfil → cambiar contraseña", () => {
  it("debería editar el perfil correctamente", async () => {
    const res = await request(app)
      .patch("/api/usuarios/perfil")
      .set(headers)
      .send({
        nombre: "Admin FlyPy",
        institucion: "UMSS",
        carrera: "Ingeniería de Sistemas",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("perfil");
    expect(res.body.perfil.nombre).toBe("Admin FlyPy");
  });

  it("debería devolver el perfil actualizado", async () => {
    const res = await request(app)
      .get("/api/usuarios/perfil")
      .set(headers);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("perfil");
    expect(res.body.perfil.nombre).toBe("Admin FlyPy");
    expect(res.body.perfil.institucion).toBe("UMSS");
    expect(res.body.perfil.carrera).toBe("Ingeniería de Sistemas");
  });

  it("debería permitir cambiar la contraseña", async () => {
    const res = await request(app)
      .patch("/api/usuarios/password")
      .set(headers)
      .send({
        nuevaPassword: "nuevaClaveSegura123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensaje");
  });
});
