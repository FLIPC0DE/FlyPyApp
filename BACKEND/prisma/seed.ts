import { PrismaClient, RolTipo } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpiando base de datos...");

  await prisma.checkpointRespuesta.deleteMany({});
  await prisma.checkpointPregunta.deleteMany({});
  await prisma.checkpoint.deleteMany({});
  await prisma.playgroundSnippet.deleteMany({});
  await prisma.contenido.deleteMany({});
  await prisma.topico.deleteMany({});
  await prisma.cursoMedia.deleteMany({});
  await prisma.cursoColaborador.deleteMany({});
  await prisma.inscripcion.deleteMany({});
  await prisma.curso.deleteMany({});
  await prisma.verificationCode.deleteMany({});
  await prisma.invitacion.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});
  await prisma.keyEvent.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.upload.deleteMany({});
  await prisma.appLog.deleteMany({});
  await prisma.perfil.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.rol.deleteMany({});

  console.log("✅ Base de datos limpia. Sembrando datos...");

  // Roles
  const rolesData = [
    { tipo: RolTipo.ADMINISTRADOR, nombre: "Administrador" },
    { tipo: RolTipo.ADMIN_AYUDANTE, nombre: "Administrador Ayudante" },
    { tipo: RolTipo.DOCENTE_EJECUTOR, nombre: "Docente Ejecutor" },
    { tipo: RolTipo.DOCENTE_EDITOR, nombre: "Docente Editor" },
    { tipo: RolTipo.ESTUDIANTE, nombre: "Estudiante" },
  ];

  const roles = [];
  for (const r of rolesData) {
    const role = await prisma.rol.create({ data: r });
    roles.push(role);
  }

  // Admin user
  const adminEmail = "pyfly.soporte@gmail.com";
  const adminPassword = "Admin#1234";
  const hashed = await bcrypt.hash(adminPassword, 10);

  const rolAdmin = roles.find((r) => r.tipo === RolTipo.ADMINISTRADOR)!;

  const admin = await prisma.usuario.create({
    data: {
      nombre: "Admin FlyPy",
      email: adminEmail,
      password: hashed,
      id_rol: rolAdmin.id_rol,
      rol_global: rolAdmin.tipo,
      perfil: {
        create: {
          institucion: "Universidad Mayor de San Simon",
        },
      },
    },
  });


  // Curso de ejemplo
  const curso = await prisma.curso.create({
    data: {
      id_creador: admin.id_usuario,
      titulo_curso: "Introducción a Python",
      slug: "introduccion-a-python",
      descripcion: "Curso demo: conceptos básicos de Python",
      fecha_inicio: new Date(),
      publicado: true,
      topicos: {
        create: [
          {
            titulo: "Variables y tipos",
            orden: 1,
            tipo: "TEXTO_IMAGEN",
            contenido: {
              create: [
                {
                  tipo: "text",
                  titulo: "Variables",
                  cuerpo:
                    "En Python las variables se asignan sin declaración previa...",
                },
                {
                  tipo: "image",
                  titulo: "Ejemplo",
                  mediaUrl:
                    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                },
              ],
            },
            playgroundSnippets: {
              create: [
                {
                  nombre: "Hola mundo",
                  codigo: 'print("Hola FlyPy")',
                  lenguaje: "python",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.inscripcion.create({
    data: {
      id_curso: curso.id_curso,
      id_usuario: admin.id_usuario,
      estado: "active",
      progress: 0,
    },
  });

  await prisma.verificationCode.create({
    data: {
      email: "teststudent@flypy.local",
      code: "123456",
      purpose: "signup",
      consumed: false,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  console.log("🌱 Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
