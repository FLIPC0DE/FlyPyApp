import app from "./server";
import { initGoogleClient } from "./config/clients/googleClient";
import { initMicrosoftClient } from "./config/clients/microsoftClient";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initGoogleClient();
    await initMicrosoftClient();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("Error al inicializar clientes OAuth:", err);
    process.exit(1);
  }
})();
