import axios from "axios";

export let microsoftClient: any;

export const initMicrosoftClient = async () => {
  const { data } = await axios.get(
    "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration"
  );

  microsoftClient = {
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    redirect_uri: "http://localhost:3000/api/oauth/microsoft/callback",
    authorization_endpoint: data.authorization_endpoint,
    token_endpoint: data.token_endpoint,
    userinfo_endpoint: "https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName",
    scope: "openid email profile User.Read",
  };
};
