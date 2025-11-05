import { Request } from "express";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { sendPasswordRecoveryEmail } from "../lib/mailer";

type UsuarioConPerfil = Prisma.UsuarioGetPayload<{ include: { perfil: true } }>;

type AuthResult = {
  token?: string;
  user: UsuarioConPerfil;
  needsRole?: boolean;
  redirectTo?: string;
};

export const registerUser = async (
  data: {
    email: string;
    password: string;
    nombre: string;
    id_rol?: number;
    codigoVerificacion: string;
  },
  req: Request
): Promise<AuthResult> => {
  const { email, password, nombre, id_rol, codigoVerificacion } = data;

  // Validar código de verificación
  const validacion = await prisma.verificationCode.findFirst({
    where: {
      email,
      code: codigoVerificacion,
      purpose: "signup",
      consumed: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!validacion) throw new Error("Código de verificación inválido o expirado");

  await prisma.verificationCode.update({
    where: { id_code: validacion.id_code },
    data: { consumed: true },
  });

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buscar rol por ID
  const rol = id_rol
    ? await prisma.rol.findUnique({ where: { id_rol } })
    : null;

  if (id_rol && !rol) throw new Error("Rol no válido");

  // Crear usuario con id_rol y rol_global
  const nuevoUsuario = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      nombre,
      id_rol: rol?.id_rol ?? null,
      rol_global: rol?.tipo ?? null,
    },
    include: {
      perfil: true,
      rol: true,
    },
  });

  // Generar token con datos completos
  const token = generateToken(
    nuevoUsuario.id_usuario,
    nuevoUsuario.rol_global ?? undefined,
    nuevoUsuario.nombre ?? undefined,
    nuevoUsuario.perfil?.avatar_url ?? undefined
  );

  // Crear sesión
  await prisma.session.create({
    data: {
      id_usuario: nuevoUsuario.id_usuario,
      token_jti: token,
      user_agent: req.headers["user-agent"],
      ip_address: req.ip,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const needsRole = !nuevoUsuario.id_rol && !nuevoUsuario.rol_global;
  const redirectTo = needsRole ? "/seleccionar-rol" : "/dashboard";

  return { token, user: nuevoUsuario, needsRole, redirectTo };
};

export const loginUser = async (
  data: { email: string; password: string },
  req: Request
): Promise<AuthResult> => {
  const user = await prisma.usuario.findUnique({
    where: { email: data.email },
    include: { perfil: true },
  });

  if (!user || !user.password) throw new Error("Credenciales inválidas");

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new Error("Credenciales inválidas");

  const token = generateToken(
    user.id_usuario,
    user.rol_global ?? undefined,
    user.nombre ?? undefined,
    user.perfil?.avatar_url ?? undefined
  );

  await prisma.session.create({
    data: {
      id_usuario: user.id_usuario,
      token_jti: token,
      user_agent: req.headers["user-agent"],
      ip_address: req.ip,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const needsRole = !user.id_rol && !user.rol_global;
  const redirectTo = needsRole ? "/seleccionar-rol" : "/dashboard";
  return { token, user, needsRole, redirectTo };
};


export const enviarCodigoRecuperacionService = async (data: { email: string }) => {
  const { email } = data;
  if (!email || !email.includes("@")) throw new Error("Email inválido");

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error("Email no registrado");

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.verificationCode.create({
    data: {
      email,
      code: codigo,
      purpose: "recovery",
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutos
    },
  });

  await sendPasswordRecoveryEmail(email, codigo);

  return { mensaje: "Código enviado al correo" };
};

export const validarCodigoRecuperacionService = async (data: { email: string; codigo: string }) => {
  const { email, codigo } = data;
  if (!email || !codigo) throw new Error("Faltan datos");

  const validacion = await prisma.verificationCode.findFirst({
    where: {
      email,
      code: codigo,
      purpose: "recovery",
      consumed: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!validacion) throw new Error("Código inválido o expirado");

  await prisma.verificationCode.update({
    where: { id_code: validacion.id_code },
    data: { consumed: true },
  });

  return { mensaje: "Código válido. Puedes cambiar tu contraseña." };
};

export const cambiarPasswordRecuperacionService = async (data: {
  email: string;
  nuevaPassword: string;
}) => {
  const { email, nuevaPassword } = data;
  if (!email || !nuevaPassword || nuevaPassword.length < 8) {
    throw new Error("Datos inválidos");
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error("Usuario no encontrado");

  const hashed = await bcrypt.hash(nuevaPassword, 10);

  await prisma.usuario.update({
    where: { email },
    data: { password: hashed },
  });

  return { mensaje: "Contraseña actualizada correctamente" };
};
