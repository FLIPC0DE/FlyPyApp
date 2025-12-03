import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/jwt";
import { googleClient } from "../config/clients/googleClient";
import { microsoftClient } from "../config/clients/microsoftClient";
import { githubClientConfig } from "../config/clients/githubClient";

export const getOAuthRedirectUrl = (provider: "google" | "microsoft" | "github"): string => {
  if (provider === "google") {
    if (!googleClient?.authorization_endpoint) throw new Error("Cliente Google no inicializado");
    return `${googleClient.authorization_endpoint}?client_id=${googleClient.client_id}&redirect_uri=${googleClient.redirect_uri}&response_type=code&scope=${googleClient.scope}`;
  }

  if (provider === "microsoft") {
    if (!microsoftClient?.authorization_endpoint) throw new Error("Cliente Microsoft no inicializado");
    return `${microsoftClient.authorization_endpoint}?client_id=${microsoftClient.client_id}&redirect_uri=${microsoftClient.redirect_uri}&response_type=code&scope=${microsoftClient.scope}`;
  }

  if (provider === "github") {
    return `${githubClientConfig.authorization_endpoint}?client_id=${githubClientConfig.client_id}&redirect_uri=${githubClientConfig.redirect_uri}&scope=${githubClientConfig.scope}`;
  }

  throw new Error("Proveedor OAuth no soportado");
};

export const handleOAuthLoginService = async (
  req: Request,
  res: Response,
  provider: "google" | "microsoft" | "github"
) => {
  console.log("🔍 Código recibido:", req.query.code);

  try {
    let tokenRes: any;
    let userinfoRes: any;
    let email = "";
    let nombre = "";
    let avatar: string | null = null;
    let sub: string | null = null;

    if (provider === "google") {
      tokenRes = await axios.post(
        googleClient.token_endpoint,
        new URLSearchParams({
          code: req.query.code as string,
          client_id: googleClient.client_id,
          client_secret: googleClient.client_secret,
          redirect_uri: googleClient.redirect_uri,
          grant_type: "authorization_code",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const accessToken = tokenRes.data.access_token;

      userinfoRes = await axios.get(googleClient.userinfo_endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      email = userinfoRes.data.email;
      nombre = userinfoRes.data.name || userinfoRes.data.given_name || "Sin nombre";
      avatar = userinfoRes.data.picture || null;
      sub = userinfoRes.data.sub || null;
    }

    if (provider === "microsoft") {
      tokenRes = await axios.post(
        microsoftClient.token_endpoint,
        new URLSearchParams({
          code: req.query.code as string,
          client_id: microsoftClient.client_id,
          client_secret: microsoftClient.client_secret,
          redirect_uri: microsoftClient.redirect_uri,
          grant_type: "authorization_code",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const accessToken = tokenRes.data.access_token;

      userinfoRes = await axios.get(microsoftClient.userinfo_endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      email = userinfoRes.data.mail || userinfoRes.data.userPrincipalName;
      nombre = userinfoRes.data.displayName || "Sin nombre";
      avatar = null;
      sub = userinfoRes.data.id || null;
    }

    if (provider === "github") {
      tokenRes = await axios.post(
        githubClientConfig.token_endpoint,
        new URLSearchParams({
          code: req.query.code as string,
          client_id: githubClientConfig.client_id,
          client_secret: githubClientConfig.client_secret,
          redirect_uri: githubClientConfig.redirect_uri,
        }),
        { headers: { Accept: "application/json" } }
      );

      const accessToken = tokenRes.data.access_token;

      userinfoRes = await axios.get(githubClientConfig.userinfo_endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const emailsRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const primaryEmail = emailsRes.data.find((e: any) => e.primary && e.verified)?.email;

      email = primaryEmail || userinfoRes.data.email || null;
      nombre = userinfoRes.data.name || userinfoRes.data.login || "Sin nombre";
      avatar = userinfoRes.data.avatar_url || null;
      sub = userinfoRes.data.id?.toString();
    }

    const { token } = await upsertOAuthUser(email, nombre, provider, sub, avatar, req);

    const frontendBase = process.env.FRONTEND_URL ?? "http://localhost:5173";
    const redirectFinal = `${frontendBase}/oauth-redirect?token=${token}`;
    return res.redirect(redirectFinal);
  } catch (err: any) {
    console.error(`❌ Error en callback de ${provider}:`, err);
    console.error("Detalles del error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      code: req.query.code,
    });
    
    const errorMessage = err.response?.data?.error_description 
      || err.response?.data?.error 
      || err.message 
      || `Error al procesar el login con ${provider}`;
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

export const upsertOAuthUser = async (
  email: string,
  nombre?: string,
  proveedor?: string,
  sub?: string | null,
  avatar?: string | null,
  req?: Request
): Promise<{ token: string }> => {
  if (!email) throw new Error("Email requerido desde el proveedor OAuth");

  let user = await prisma.usuario.findUnique({
    where: { email },
    include: { perfil: true },
  });

  if (!user) {
    await prisma.usuario.create({
      data: {
        email,
        nombre: nombre ?? "Sin nombre",
        password: null,
        id_rol: null,
        rol_global: null,
      },
    });

    user = await prisma.usuario.findUnique({
      where: { email },
      include: { perfil: true },
    });

    if (!user) throw new Error("Error al crear usuario OAuth");
  }

  const existingAccount = await prisma.cuentaOAuth.findUnique({
    where: {
      proveedor_email: {
        proveedor: proveedor!,
        email,
      },
    },
  });

  if (!existingAccount) {
    await prisma.cuentaOAuth.create({
      data: {
        id_usuario: user.id_usuario,
        proveedor: proveedor!,
        sub: sub ?? "",
        email,
        nombre,
      },
    });
  } else {
    await prisma.cuentaOAuth.update({
      where: { id: existingAccount.id },
      data: { ultima_sesion: new Date() },
    });
  }

  if (avatar) {
    await prisma.perfil.upsert({
      where: { id_usuario: user.id_usuario },
      update: { avatar_url: avatar },
      create: {
        id_usuario: user.id_usuario,
        avatar_url: avatar,
      },
    });
  }

  const refreshed = await prisma.usuario.findUnique({
    where: { email },
    include: { perfil: true },
  });

  if (!refreshed) throw new Error("Usuario no encontrado tras refrescar perfil");

  const token = generateToken(
    refreshed.id_usuario,
    refreshed.rol_global ?? undefined,
    refreshed.nombre ?? undefined,
    refreshed.perfil?.avatar_url ?? undefined
  );

  if (req) {
    await prisma.session.create({
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
