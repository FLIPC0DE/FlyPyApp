// src/types/auth.ts

import { RolTipo } from "@prisma/client";
import { Request } from "express";

export type AuthUser = {
  id_usuario: number;
  email?: string;
  rol_global?: RolTipo | null;
  id_rol?: number | null;
  nombre?: string;
};

export interface AuthenticatedRequest<TBody = any> extends Request {
  user?: AuthUser;
  body: TBody;
}
