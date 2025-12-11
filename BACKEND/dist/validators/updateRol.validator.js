"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRolSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.updateRolSchema = zod_1.z.object({
    id_rol: zod_1.z.number().int().optional(),
    rol_global: zod_1.z.nativeEnum(client_1.RolTipo).optional(),
});
