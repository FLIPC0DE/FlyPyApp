"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubClientConfig = void 0;
exports.githubClientConfig = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    redirect_uri: "http://localhost:3000/api/oauth/github/callback",
    authorization_endpoint: "https://github.com/login/oauth/authorize",
    token_endpoint: "https://github.com/login/oauth/access_token",
    userinfo_endpoint: "https://api.github.com/user",
    scope: "user:email",
};
