import { handleOAuthLoginService } from "../services/oauth.service.js";

export const googleCallback = async (req, res) => {
    await handleOAuthLoginService(req, res, "google");
};

export const microsoftCallback = async (req, res) => {
    await handleOAuthLoginService(req, res, "microsoft");
};

export const githubCallback = async (req, res) => {
    await handleOAuthLoginService(req, res, "github");
};
