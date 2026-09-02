import type { AdminSession, Permission, ProfileTokenSummary, ProtectedRoute } from "./types";

export const protectedRoutes: ProtectedRoute[] = [
  {
    href: "/",
    label: "Operations",
    eyebrow: "Pilotage",
    requiredAnyPermissions: ["OPERATIONS_READ"]
  },
  {
    href: "/users",
    label: "Utilisateurs",
    eyebrow: "Pilotage",
    requiredAnyPermissions: ["OPERATIONS_READ"]
  },
  {
    href: "/profiles",
    label: "Profils",
    eyebrow: "Pilotage",
    requiredAnyPermissions: ["OPERATIONS_READ"]
  },
  {
    href: "/announcements",
    label: "Annonces",
    eyebrow: "Pilotage",
    requiredAnyPermissions: ["OPERATIONS_READ"]
  },
  {
    href: "/bookings",
    label: "Reservations",
    eyebrow: "Pilotage",
    requiredAnyPermissions: ["OPERATIONS_READ"]
  },
  {
    href: "/payments",
    label: "Paiements",
    eyebrow: "Pilotage",
    requiredAnyPermissions: ["OPERATIONS_READ"]
  },
  {
    href: "/reconciliation",
    label: "Reconciliation",
    eyebrow: "Pilotage",
    requiredAnyPermissions: ["PAYMENT_RECONCILE_READ"]
  },
  {
    href: "/kyc",
    label: "KYC",
    eyebrow: "Confiance",
    requiredAnyPermissions: ["KYC_REVIEW_READ"]
  },
  {
    href: "/moderation",
    label: "Moderation",
    eyebrow: "Confiance",
    requiredAnyPermissions: ["MODERATION_READ"]
  },
  {
    href: "/pricing",
    label: "Tarification",
    eyebrow: "SIG",
    requiredAnyPermissions: ["PRICING_READ", "GIS_READ"]
  },
  {
    href: "/kpi",
    label: "KPI",
    eyebrow: "Analytics",
    requiredAnyPermissions: ["KPI_READ"]
  },
  {
    href: "/agency",
    label: "Agence",
    eyebrow: "Agence",
    requiredActiveProfileType: "AGENCY",
    requireValidatedActiveProfile: true,
    requiredAnyPermissions: ["AGENCY_STATS_READ"]
  }
];

const publicPaths = new Set(["/login", "/unauthorized", "/session-expired", "/api/logout"]);

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }
  const withoutTrailingSlash = pathname.replace(/\/+$/, "");
  return withoutTrailingSlash || "/";
}

export function isPublicPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return publicPaths.has(path) || path.startsWith("/_astro/") || /\.[A-Za-z0-9]+$/.test(path);
}

export function getProtectedRoute(pathname: string): ProtectedRoute | undefined {
  const path = normalizePath(pathname);
  return protectedRoutes.find((route) => normalizePath(route.href) === path);
}

export function getActiveProfile(session: AdminSession): ProfileTokenSummary | undefined {
  if (session.activeProfileId) {
    return session.profiles.find((profile) => profile.id === session.activeProfileId);
  }
  return session.profiles.find((profile) => profile.active);
}

export function hasAnyPermission(session: AdminSession, permissions: Permission[] = []): boolean {
  if (permissions.length === 0) {
    return true;
  }
  return permissions.some((permission) => session.permissions.includes(permission));
}

export function isBackOfficeProfileAllowed(session: AdminSession): boolean {
  const activeProfile = getActiveProfile(session);
  if (!activeProfile) {
    return false;
  }
  if (activeProfile.type === "ADMIN") {
    return session.activeProfileType === "ADMIN";
  }
  return (
    activeProfile.type === "AGENCY" &&
    session.activeProfileType === "AGENCY" &&
    activeProfile.validationStatus === "VALIDATED" &&
    session.permissions.includes("AGENCY_STATS_READ")
  );
}

export function canAccessRoute(route: ProtectedRoute, session: AdminSession): boolean {
  const activeProfile = getActiveProfile(session);
  if (!isBackOfficeProfileAllowed(session) || !activeProfile) {
    return false;
  }
  if (route.requiredActiveProfileType && activeProfile.type !== route.requiredActiveProfileType) {
    return false;
  }
  if (route.requireValidatedActiveProfile && activeProfile.validationStatus !== "VALIDATED") {
    return false;
  }
  return hasAnyPermission(session, route.requiredAnyPermissions);
}

export function canAccessPath(pathname: string, session: AdminSession): boolean {
  const route = getProtectedRoute(pathname);
  return route ? canAccessRoute(route, session) : false;
}

export function getVisibleNavItems(session: AdminSession): ProtectedRoute[] {
  return protectedRoutes.filter((route) => canAccessRoute(route, session));
}

export function firstAccessiblePath(session: AdminSession): string | null {
  return getVisibleNavItems(session)[0]?.href ?? null;
}

export function sanitizeNextPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }
  try {
    const url = new URL(value, "http://motodi-admin.local");
    if (url.origin !== "http://motodi-admin.local") {
      return null;
    }
    const path = normalizePath(url.pathname);
    if (isPublicPath(path)) {
      return null;
    }
    return `${path}${url.search}`;
  }
  catch {
    return null;
  }
}

export function resolvePostLoginPath(nextPath: string | null | undefined, session: AdminSession): string {
  const sanitizedNext = sanitizeNextPath(nextPath);
  if (sanitizedNext && canAccessPath(new URL(sanitizedNext, "http://motodi-admin.local").pathname, session)) {
    return sanitizedNext;
  }
  return firstAccessiblePath(session) ?? "/unauthorized";
}
