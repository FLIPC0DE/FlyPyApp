import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }
    // opcional: reemplazar body con parsed value
    req.body = result.data;
    next();
  };
};
