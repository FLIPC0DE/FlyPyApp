"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMicrosoftClient = exports.microsoftClient = void 0;
const axios_1 = __importDefault(require("axios"));
const initMicrosoftClient = async () => {
    const { data } = await axios_1.default.get("https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration");
    exports.microsoftClient = {
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/api/oauth/microsoft/callback",
        authorization_endpoint: data.authorization_endpoint,
        token_endpoint: data.token_endpoint,
        userinfo_endpoint: "https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName",
        scope: "openid email profile User.Read",
    };
};
exports.initMicrosoftClient = initMicrosoftClient;
