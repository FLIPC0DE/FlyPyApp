import { sendVerificationCodeService } from "@/services/mailer.service";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mailer";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    verificationCode: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/mailer", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
}));

describe("mailer.service.ts", () => {
  it("envía código de verificación correctamente", async () => {
    const email = "pyfly.soporte@gmail.com";

    await sendVerificationCodeService(email);
    expect(prisma.verificationCode.create).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalledWith(email, expect.any(String));
  });
});
