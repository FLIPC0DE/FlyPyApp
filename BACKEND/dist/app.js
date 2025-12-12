"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const googleClient_1 = require("./config/clients/googleClient");
const microsoftClient_1 = require("./config/clients/microsoftClient");
const PORT = process.env.PORT || 3000;
(async () => {
    try {
        await (0, googleClient_1.initGoogleClient)();
        await (0, microsoftClient_1.initMicrosoftClient)();
        server_1.default.listen(PORT, () => {
            console.log(`Servidor escuchando en puerto ${PORT}`);
        });
    }
    catch (err) {
        console.error("Error al inicializar clientes OAuth:", err);
        process.exit(1);
    }
})();
