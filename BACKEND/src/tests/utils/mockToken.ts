import jwt from "jsonwebtoken";

export const generarTokenMock = (payload = {}) => {
  return jwt.sign(
    {
      userId: 1,
      nombre: "Mocked User",
      rol_global: "ESTUDIANTE",
      ...payload,
    },
    "clave-secreta",
    { expiresIn: "1h" }
  );
};
