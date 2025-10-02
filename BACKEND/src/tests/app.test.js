import request from "supertest";
import app from "../src/index.js"; // exporta tu app en index.js

test("GET / responde con mensaje de bienvenida", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("mensaje");
});
