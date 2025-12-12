"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertOAuthUser = exports.handleOAuthLoginService = exports.getOAuthRedirectUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const googleClient_1 = require("../config/clients/googleClient");
const microsoftClient_1 = require("../config/clients/microsoftClient");
const githubClient_1 = require("../config/clients/githubClient");
const getOAuthRedirectUrl = (provider) => {
    if (provider === "google") {
        if (!googleClient_1.googleClient?.authorization_endpoint)
            throw new Error("Cliente Google no inicializado");
        return `${googleClient_1.googleClient.authorization_endpoint}?client_id=${googleClient_1.googleClient.client_id}&redirect_uri=${googleClient_1.googleClient.redirect_uri}&response_type=code&scope=${googleClient_1.googleClient.scope}`;
    }
    if (provider === "microsoft") {
        if (!microsoftClient_1.microsoftClient?.authorization_endpoint)
            throw new Error("Cliente Microsoft no inicializado");
        return `${microsoftClient_1.microsoftClient.authorization_endpoint}?client_id=${microsoftClient_1.microsoftClient.client_id}&redirect_uri=${microsoftClient_1.microsoftClient.redirect_uri}&response_type=code&scope=${microsoftClient_1.microsoftClient.scope}`;
    }
    if (provider === "github") {
        return `${githubClient_1.githubClientConfig.authorization_endpoint}?client_id=${githubClient_1.githubClientConfig.client_id}&redirect_uri=${githubClient_1.githubClientConfig.redirect_uri}&scope=${githubClient_1.githubClientConfig.scope}`;
    }
    throw new Error("Proveedor OAuth no soportado");
};
exports.getOAuthRedirectUrl = getOAuthRedirectUrl;
const handleOAuthLoginService = async (req, res, provider) => {
    console.log("🔍 Código recibido:", req.query.code);
    try {
        let tokenRes;
        let userinfoRes;
        let email = "";
        let nombre = "";
        let avatar = null;
        let sub = null;
        if (provider === "google") {
            tokenRes = await axios_1.default.post(googleClient_1.googleClient.token_endpoint, new URLSearchParams({
                code: req.query.code,
                client_id: googleClient_1.googleClient.client_id,
                client_secret: googleClient_1.googleClient.client_secret,
                redirect_uri: googleClient_1.googleClient.redirect_uri,
                grant_type: "authorization_code",
            }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            const accessToken = tokenRes.data.access_token;
            userinfoRes = await axios_1.default.get(googleClient_1.googleClient.userinfo_endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            email = userinfoRes.data.email;
            nombre = userinfoRes.data.name || userinfoRes.data.given_name || "Sin nombre";
            avatar = userinfoRes.data.picture || null;
            sub = userinfoRes.data.sub || null;
        }
        if (provider === "microsoft") {
            tokenRes = await axios_1.default.post(microsoftClient_1.microsoftClient.token_endpoint, new URLSearchParams({
                code: req.query.code,
                client_id: microsoftClient_1.microsoftClient.client_id,
                client_secret: microsoftClient_1.microsoftClient.client_secret,
                redirect_uri: microsoftClient_1.microsoftClient.redirect_uri,
                grant_type: "authorization_code",
            }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
            const accessToken = tokenRes.data.access_token;
            userinfoRes = await axios_1.default.get(microsoftClient_1.microsoftClient.userinfo_endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            email = userinfoRes.data.mail || userinfoRes.data.userPrincipalName;
            nombre = userinfoRes.data.displayName || "Sin nombre";
            avatar = null;
            sub = userinfoRes.data.id || null;
        }
        if (provider === "github") {
            tokenRes = await axios_1.default.post(githubClient_1.githubClientConfig.token_endpoint, new URLSearchParams({
                code: req.query.code,
                client_id: githubClient_1.githubClientConfig.client_id,
                client_secret: githubClient_1.githubClientConfig.client_secret,
                redirect_uri: githubClient_1.githubClientConfig.redirect_uri,
            }), { headers: { Accept: "application/json" } });
            const accessToken = tokenRes.data.access_token;
            userinfoRes = await axios_1.default.get(githubClient_1.githubClientConfig.userinfo_endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const emailsRes = await axios_1.default.get("https://api.github.com/user/emails", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const primaryEmail = emailsRes.data.find((e) => e.primary && e.verified)?.email;
            email = primaryEmail || userinfoRes.data.email || null;
            nombre = userinfoRes.data.name || userinfoRes.data.login || "Sin nombre";
            avatar = userinfoRes.data.avatar_url || null;
            sub = userinfoRes.data.id?.toString();
        }
        const { token } = await (0, exports.upsertOAuthUser)(email, nombre, provider, sub, avatar, req);
        const frontendBase = process.env.FRONTEND_URL ?? "http://localhost:5173";
        const redirectFinal = `${frontendBase}/oauth-redirect?token=${token}`;
        return res.redirect(redirectFinal);
    }
    catch (err) {
        console.error(`Error en callback de ${provider}:`, err);
        res.status(500).json({ error: `Error al procesar el login con ${provider}` });
    }
};
exports.handleOAuthLoginService = handleOAuthLoginService;
const upsertOAuthUser = async (email, nombre, proveedor, sub, avatar, req) => {
    if (!email)
        throw new Error("Email requerido desde el proveedor OAuth");
    let user = await prisma_1.prisma.usuario.findUnique({
        where: { email },
        include: { perfil: true },
    });
    if (!user) {
        await prisma_1.prisma.usuario.create({
            data: {
                email,
                nombre: nombre ?? "Sin nombre",
                password: null,
                id_rol: null,
                rol_global: null,
            },
        });
        user = await prisma_1.prisma.usuario.findUnique({
            where: { email },
            include: { perfil: true },
        });
        if (!user)
            throw new Error("Error al crear usuario OAuth");
    }
    const existingAccount = await prisma_1.prisma.cuentaOAuth.findUnique({
        where: {
            proveedor_email: {
                proveedor: proveedor,
                email,
            },
        },
    });
    if (!existingAccount) {
        await prisma_1.prisma.cuentaOAuth.create({
            data: {
                id_usuario: user.id_usuario,
                proveedor: proveedor,
                sub: sub ?? "",
                email,
                nombre,
            },
        });
    }
    else {
        await prisma_1.prisma.cuentaOAuth.update({
            where: { id: existingAccount.id },
            data: { ultima_sesion: new Date() },
        });
    }
    if (avatar) {
        await prisma_1.prisma.perfil.upsert({
            where: { id_usuario: user.id_usuario },
            update: { avatar_url: avatar },
            create: {
                id_usuario: user.id_usuario,
                avatar_url: avatar,
            },
        });
    }
    const refreshed = await prisma_1.prisma.usuario.findUnique({
        where: { email },
        include: { perfil: true },
    });
    if (!refreshed)
        throw new Error("Usuario no encontrado tras refrescar perfil");
    const token = (0, jwt_1.generateToken)(refreshed.id_usuario, refreshed.rol_global ?? undefined, refreshed.nombre ?? undefined, refreshed.perfil?.avatar_url ?? undefined);
    if (req) {
        await prisma_1.prisma.session.create({
            data: {
                id_usuario: refreshed.id_usuario,
                token_jti: token,
                user_agent: req.headers["user-agent"],
                ip_address: req.ip,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            },
        });
    }
    return { token };
};
exports.upsertOAuthUser = upsertOAuthUser;
