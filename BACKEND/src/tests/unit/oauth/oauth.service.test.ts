import { getOAuthRedirectUrl } from "@/services/oauth.service";

jest.mock("@/config/clients/googleClient", () => ({
    googleClient: {
        authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        client_id: "test-client",
        redirect_uri: "http://localhost:3000/callback",
        scope: "email",
    },
}));

jest.mock("@/config/clients/microsoftClient", () => ({
    microsoftClient: {
        authorization_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        client_id: "ms-client",
        redirect_uri: "http://localhost:3000/ms",
        scope: "email",
    },
}));

describe("oauth.service.ts", () => {
    it("genera URL de redirección para Google", () => {
        process.env.GOOGLE_CLIENT_ID = "test-client";
        process.env.GOOGLE_REDIRECT_URI = "http://localhost:3000/callback";
        process.env.GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
        process.env.GOOGLE_SCOPE = "email";

        const url = getOAuthRedirectUrl("google");
        expect(url).toMatch(/accounts\.google\.com/);
        expect(url).toContain("client_id=test-client");
    });

    it("genera URL de redirección para Microsoft", () => {
        process.env.MICROSOFT_CLIENT_ID = "ms-client";
        process.env.MICROSOFT_REDIRECT_URI = "http://localhost:3000/ms";
        process.env.MICROSOFT_AUTH_ENDPOINT = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
        process.env.MICROSOFT_SCOPE = "email";

        const url = getOAuthRedirectUrl("microsoft");
        expect(url).toMatch(/login\.microsoftonline\.com/);
    });

    it("genera URL de redirección para GitHub", () => {
        process.env.GITHUB_CLIENT_ID = "gh-client";
        process.env.GITHUB_REDIRECT_URI = "http://localhost:3000/gh";
        process.env.GITHUB_AUTH_ENDPOINT = "https://github.com/login/oauth/authorize";
        process.env.GITHUB_SCOPE = "user:email";

        const url = getOAuthRedirectUrl("github");
        expect(url).toMatch(/github\.com\/login\/oauth\/authorize/);
    });
});
