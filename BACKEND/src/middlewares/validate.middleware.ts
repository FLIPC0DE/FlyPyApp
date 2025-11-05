import { ZodTypeAny } from "zod";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";

export const validate = <T extends ZodTypeAny>(schema: T) => {
  return (req: AuthenticatedRequest<unknown>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }
    req.body = result.data;
    next();
  };
};
