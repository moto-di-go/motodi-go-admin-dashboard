import { defineMiddleware } from "astro:middleware";
import type { APIContext } from "astro";

import {
  canAccessRoute,
  getProtectedRoute,
  getVisibleNavItems,
  isPublicPath,
  normalizePath
} from "./lib/auth/rbac";
import { refreshAdminSession } from "./lib/auth/service";
import {
  destroyStoredAdminSession,
  getStoredAdminSession,
  isAccessTokenStale,
  isRefreshTokenExpired,
  saveStoredAdminSession
} from "./lib/auth/session";
import type { AdminSession } from "./lib/auth/types";

export const onRequest = defineMiddleware(async (context, next) => {
  const path = normalizePath(context.url.pathname);

  if (isPublicPath(path)) {
    await exposeSessionLocals(context);
    return next();
  }

  let session = await getStoredAdminSession(context.session);
  if (!session) {
    return context.redirect(loginUrl(context), 302);
  }

  if (isRefreshTokenExpired(session)) {
    destroyStoredAdminSession(context.session);
    return context.redirect("/session-expired", 302);
  }

  if (isAccessTokenStale(session)) {
    try {
      session = await refreshAdminSession(session);
      saveStoredAdminSession(context.session, session);
    }
    catch {
      destroyStoredAdminSession(context.session);
      return context.redirect("/session-expired", 302);
    }
  }

  setSessionLocals(context, session);

  const route = getProtectedRoute(path);
  if (route && !canAccessRoute(route, session)) {
    return context.redirect(`/unauthorized?from=${encodeURIComponent(context.url.pathname)}`, 302);
  }

  return next();
});

async function exposeSessionLocals(context: APIContext): Promise<void> {
  const session = await getStoredAdminSession(context.session);
  if (session) {
    setSessionLocals(context, session);
  }
}

function setSessionLocals(context: { locals: App.Locals }, session: AdminSession): void {
  context.locals.adminSession = session;
  context.locals.navigation = getVisibleNavItems(session);
}

function loginUrl(context: { url: URL }): string {
  const next = `${context.url.pathname}${context.url.search}`;
  return `/login?next=${encodeURIComponent(next)}`;
}
