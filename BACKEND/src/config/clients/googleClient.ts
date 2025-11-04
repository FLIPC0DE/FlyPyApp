import axios from "axios";

type GoogleClientConfig = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  scope: string;
};

export let googleClient: GoogleClientConfig;

export const initGoogleClient = async () => {
  const { data } = await axios.get("https://accounts.google.com/.well-known/openid-configuration");

  googleClient = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: "http://localhost:3000/api/oauth/google/callback",
    authorization_endpoint: data.authorization_endpoint,
    token_endpoint: data.token_endpoint,
    userinfo_endpoint: data.userinfo_endpoint,
    scope: "openid email profile",
  };
};
