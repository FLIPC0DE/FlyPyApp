import { generarTokenMock } from "./mockToken";

export const headersConToken = (payload = {}) => {
  const token = generarTokenMock(payload);
  return {
    Authorization: `Bearer ${token}`,
  };
};
