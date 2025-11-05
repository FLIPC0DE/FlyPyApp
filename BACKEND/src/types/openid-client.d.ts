import type { Issuer as IssuerType } from "openid-client";

declare module "openid-client" {
  export const Issuer: typeof IssuerType;
}
