import type { APIRoute } from "astro";

import { config } from "../../../lib/config";
import { getStoredAdminSession } from "../../../lib/auth/session";

export const GET: APIRoute = async (context) => {
  const session = await getStoredAdminSession(context.session);
  if (!session) {
    return context.redirect("/login", 302);
  }
  if (!session.permissions.includes("KPI_READ")) {
    return context.redirect("/unauthorized", 302);
  }

  const upstream = new URL(`${config.apiBaseUrl}/admin/kpi/export.csv`);
  for (const [key, value] of context.url.searchParams.entries()) {
    upstream.searchParams.set(key, value);
  }

  const response = await fetch(upstream, {
    headers: {
      Accept: "text/csv",
      Authorization: `Bearer ${session.accessToken}`,
      "X-Correlation-Id": crypto.randomUUID()
    }
  });

  if (!response.ok) {
    return new Response("Export indisponible.", { status: response.status });
  }

  return new Response(await response.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kpi-export.csv"'
    }
  });
};
