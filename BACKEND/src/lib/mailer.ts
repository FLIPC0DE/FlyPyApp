import nodemailer from "nodemailer";
import { renderFlyPyEmailTemplate } from "./template/email.template.js";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to: string, code: string) => {
  const html = renderFlyPyEmailTemplate({
    title: "Verifica tu correo",
    body: "<p>Tu código de verificación es:</p><p>Este código expirará en 10 minutos.</p>",
    highlight: code,
  });

  await transporter.sendMail({
    from: `"FlyPy" <${process.env.SMTP_USER}>`,
    to,
    subject: "Código de verificación",
    html,
  });
};

export const sendPasswordRecoveryEmail = async (to: string, code: string) => {
  const html = renderFlyPyEmailTemplate({
    title: "Recupera tu contraseña",
    body: "<p>Tu código de recuperación es:</p><p>Este código expirará en 10 minutos.</p>",
    highlight: code,
  });

  await transporter.sendMail({
    from: `"FlyPy" <${process.env.SMTP_USER}>`,
    to,
    subject: "Código de recuperación de contraseña",
    html,
  });
};


