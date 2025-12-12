"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../server"));
// ✅ Mock para evitar errores de cliente no inicializado
jest.mock("@/services/oauth.service", () => ({
    getOAuthRedirectUrl: (provider) => `https://mocked-oauth.com/${provider}`,
}));
describe("Rutas de OAuth", () => {
    describe("GET /api/oauth/google", () => {
        it("debería redirigir a Google OAuth", async () => {
            const res = await (0, supertest_1.default)(server_1.default).get("/api/oauth/google");
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toMatch(/mocked-oauth\.com\/google/);
        });
    });
    describe("GET /api/oauth/microsoft", () => {
        it("debería redirigir a Microsoft OAuth", async () => {
            const res = await (0, supertest_1.default)(server_1.default).get("/api/oauth/microsoft");
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toMatch(/mocked-oauth\.com\/microsoft/);
        });
    });
    describe("GET /api/oauth/github", () => {
        it("debería redirigir a GitHub OAuth", async () => {
            const res = await (0, supertest_1.default)(server_1.default).get("/api/oauth/github");
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toMatch(/mocked-oauth\.com\/github/);
        });
    });
});
