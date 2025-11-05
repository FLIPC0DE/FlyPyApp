import { Request, Response } from "express";
import { handleOAuthLoginService } from "../services/oauth.service.js";

export const googleCallback = async (req: Request, res: Response) => {
  await handleOAuthLoginService(req, res, "google");
};

export const microsoftCallback = async (req: Request, res: Response) => {
  await handleOAuthLoginService(req, res, "microsoft");
};

export const githubCallback = async (req: Request, res: Response) => {
  await handleOAuthLoginService(req, res, "github");
};
