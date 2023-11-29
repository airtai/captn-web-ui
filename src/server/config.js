export const ADS_SERVER_URL =
  process.env.ADS_SERVER_URL || "http://127.0.0.1:9000";

// WASP_WEB_CLIENT_URL will be set up by Wasp when deploying to production: https://wasp-lang.dev/docs/deploying
export const DOMAIN =
  process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";
