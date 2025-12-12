"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubCallback = exports.microsoftCallback = exports.googleCallback = void 0;
const oauth_service_1 = require("../services/oauth.service");
const googleCallback = async (req, res) => {
    await (0, oauth_service_1.handleOAuthLoginService)(req, res, "google");
};
exports.googleCallback = googleCallback;
const microsoftCallback = async (req, res) => {
    await (0, oauth_service_1.handleOAuthLoginService)(req, res, "microsoft");
};
exports.microsoftCallback = microsoftCallback;
const githubCallback = async (req, res) => {
    await (0, oauth_service_1.handleOAuthLoginService)(req, res, "github");
};
exports.githubCallback = githubCallback;
