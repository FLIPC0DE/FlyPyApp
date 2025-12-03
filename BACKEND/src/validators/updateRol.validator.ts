import { z } from "zod";
import { RolTipo } from "@prisma/client";

export const updateRolSchema = z.object({
  id_rol: z.number().int().optional(),
  rol_global: z.nativeEnum(RolTipo).optional(),
});
