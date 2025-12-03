jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-token"),
  verify: jest.fn(() => ({
    userId: 1,
    nombre: "Mocked User",
    rol_global: "ESTUDIANTE",
    avatar_url: "https://mocked-avatar.com/avatar.png",
  })),
}));
