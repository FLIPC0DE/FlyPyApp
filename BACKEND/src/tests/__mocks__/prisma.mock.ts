jest.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    perfil: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    cuentaOAuth: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
    rol: {
      findUnique: jest.fn(),
    },
    verificationCode: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));
