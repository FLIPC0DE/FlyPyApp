import request from "supertest";
import app from "../../../server";

// ✅ Mock para evitar errores de cliente no inicializado
jest.mock("@/services/oauth.service", () => ({
  getOAuthRedirectUrl: (provider: string) => `https://mocked-oauth.com/${provider}`,
}));

describe("Rutas de OAuth", () => {
  describe("GET /api/oauth/google", () => {
    it("debería redirigir a Google OAuth", async () => {
      const res = await request(app).get("/api/oauth/google");
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toMatch(/mocked-oauth\.com\/google/);
    });
  });

  describe("GET /api/oauth/microsoft", () => {
    it("debería redirigir a Microsoft OAuth", async () => {
      const res = await request(app).get("/api/oauth/microsoft");
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toMatch(/mocked-oauth\.com\/microsoft/);
    });
  });

  describe("GET /api/oauth/github", () => {
    it("debería redirigir a GitHub OAuth", async () => {
      const res = await request(app).get("/api/oauth/github");
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toMatch(/mocked-oauth\.com\/github/);
    });
  });
});
