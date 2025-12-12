"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordRecoveryEmail = exports.sendVerificationEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_template_1 = require("./template/email.template");
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendVerificationEmail = async (to, code) => {
    const html = (0, email_template_1.renderFlyPyEmailTemplate)({
        title: "Verifica tu correo",
        body: "<p>Tu código de verificación es:</p><p>Este código expirará en 10 minutos.</p>",
        highlight: code,
    });
    await exports.transporter.sendMail({
        from: `"FlyPy" <${process.env.SMTP_USER}>`,
        to,
        subject: "Código de verificación",
        html,
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordRecoveryEmail = async (to, code) => {
    const html = (0, email_template_1.renderFlyPyEmailTemplate)({
        title: "Recupera tu contraseña",
        body: "<p>Tu código de recuperación es:</p><p>Este código expirará en 10 minutos.</p>",
        highlight: code,
    });
    await exports.transporter.sendMail({
        from: `"FlyPy" <${process.env.SMTP_USER}>`,
        to,
        subject: "Código de recuperación de contraseña",
        html,
    });
};
exports.sendPasswordRecoveryEmail = sendPasswordRecoveryEmail;
