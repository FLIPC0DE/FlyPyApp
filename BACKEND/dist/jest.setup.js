"use strict";
// /// <reference types="jest" />
Object.defineProperty(exports, "__esModule", { value: true });
// jest.mock("nodemailer", () => ({
//   createTransport: () => ({
//     sendMail: jest.fn().mockResolvedValue(true),
//   }),
// }));
// jest.mock("./src/services/oauth.service", () => ({
//   getOAuthRedirectUrl: (provider: string) => `https://mocked-oauth.com/${provider}`,
// }));
// jest.mock("jsonwebtoken", () => ({
//   sign: jest.fn(() => "mocked-token"),
//   verify: jest.fn(() => ({
//     userId: 1,
//     nombre: "Mocked User",
//     rol_global: "ESTUDIANTE",
//     avatar_url: "https://mocked-avatar.com/avatar.png",
//   })),
// }));
// jest.mock("axios", () => ({
//   post: jest.fn().mockResolvedValue({ data: { access_token: "mocked-access-token" } }),
//   get: jest.fn().mockResolvedValue({ data: { email: "mocked@email.com", name: "Mocked User" } }),
// }));
// jest.mock("bcrypt", () => ({
//   hash: jest.fn().mockResolvedValue("hashed-password"),
//   compare: jest.fn().mockResolvedValue(true),
// }));
// jest.mock("./src/lib/prisma", () => ({
//   prisma: {
//     usuario: {
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       findMany: jest.fn(),
//     },
//     perfil: {
//       findUnique: jest.fn(),
//       upsert: jest.fn(),
//     },
//     cuentaOAuth: {
//       findUnique: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//     },
//     session: {
//       create: jest.fn(),
//     },
//     rol: {
//       findUnique: jest.fn(),
//     },
//   },
// }));
/// <reference types="jest" />
require("./tests/__mocks__/jwt.mock");
require("./tests/__mocks__/bcrypt.mock");
require("./tests/__mocks__/nodemailer.mock");
require("./tests/__mocks__/prisma.mock");
