import type { APIRoute } from "astro";

import { logoutAdmin } from "../../lib/auth/service";
import { destroyStoredAdminSession, getStoredAdminSession } from "../../lib/auth/session";

export const POST: APIRoute = async (context) => {
  const session = await getStoredAdminSession(context.session);
  await logoutAdmin(session);
  destroyStoredAdminSession(context.session);
  return context.redirect("/login", 303);
};

export const GET: APIRoute = (context) => context.redirect("/login", 302);
