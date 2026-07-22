import node from "@astrojs/node";
import { defineConfig } from "astro/config";

const sessionCookieName = process.env.ADMIN_SESSION_COOKIE_NAME ?? "motodi_admin_session";
const appEnv = process.env.PUBLIC_APP_ENV ?? "local";
const sessionCookieSecure = process.env.ADMIN_SESSION_COOKIE_SECURE
  ? process.env.ADMIN_SESSION_COOKIE_SECURE === "true"
  : appEnv !== "local";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  session: {
    cookie: {
      name: sessionCookieName,
      sameSite: "lax",
      path: "/",
      secure: sessionCookieSecure
    },
    ttl: 60 * 60 * 24 * 30
  },
  server: {
    host: "0.0.0.0",
    port: 3000
  }
});
