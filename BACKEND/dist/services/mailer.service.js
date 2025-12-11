"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationService = exports.sendPasswordResetService = exports.sendVerificationCodeService = void 0;
const prisma_1 = require("../lib/prisma");
const mailer_1 = require("../lib/mailer");
const crypto_1 = __importDefault(require("crypto"));
const sendVerificationCodeService = async (email) => {
    const code = crypto_1.default.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    await prisma_1.prisma.verificationCode.create({
        data: {
            email,
            code,
            purpose: "signup",
            expiresAt,
        },
    });
    await (0, mailer_1.sendVerificationEmail)(email, code);
};
exports.sendVerificationCodeService = sendVerificationCodeService;
// 🕳️ Placeholder para recuperación de contraseña
const sendPasswordResetService = async (_email) => {
    // lógica futura
};
exports.sendPasswordResetService = sendPasswordResetService;
// 🕳️ Placeholder para notificaciones
const sendNotificationService = async (_email, _message) => {
    // lógica futura
};
exports.sendNotificationService = sendNotificationService;
