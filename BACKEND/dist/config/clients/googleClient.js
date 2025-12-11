"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGoogleClient = exports.googleClient = void 0;
const axios_1 = __importDefault(require("axios"));
const initGoogleClient = async () => {
    const { data } = await axios_1.default.get("https://accounts.google.com/.well-known/openid-configuration");
    exports.googleClient = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/api/oauth/google/callback",
        authorization_endpoint: data.authorization_endpoint,
        token_endpoint: data.token_endpoint,
        userinfo_endpoint: data.userinfo_endpoint,
        scope: "openid email profile",
    };
};
exports.initGoogleClient = initGoogleClient;
