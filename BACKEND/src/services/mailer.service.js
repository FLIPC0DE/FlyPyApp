import { prisma } from "../lib/prisma.js";
import { sendVerificationEmail } from "../lib/mailer.js";
import crypto from "crypto";

export const sendVerificationCodeService = async (email) => {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    await prisma.verificationCode.create({
        data: {
            email,
            code,
            purpose: "signup",
            expiresAt,
        },
    });
    await sendVerificationEmail(email, code);
};
// 🕳️ Placeholder para recuperación de contraseña
// export const sendPasswordResetService = async (_email: string) => {
//   // lógica futura
// };
// 🕳️ Placeholder para notificaciones
// export const sendNotificationService = async (_email: string, _message: string) => {
//   // lógica futura
// };
