import { apiRequest } from "./api-client";
import type { KpiSnapshot } from "../kpi/types";

export type KpiPeriod = "7d" | "30d" | "month";

export interface KpiQueryParams {
  from?: string;
  to?: string;
  period?: KpiPeriod | string;
}

export function getKpiSnapshot(accessToken: string, params: KpiQueryParams = {}): Promise<KpiSnapshot> {
  const query = toQuery(params);
  return apiRequest<KpiSnapshot>(`/admin/kpi${query ? `?${query}` : ""}`, { accessToken });
}

export function kpiExportPath(params: KpiQueryParams = {}): string {
  const query = toQuery(params);
  return `/api/kpi/export.csv${query ? `?${query}` : ""}`;
}

export function toKpiQuery(params: KpiQueryParams): string {
  return toQuery(params);
}

function toQuery(params: KpiQueryParams | Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }
    search.set(key, String(value));
  }
  return search.toString();
}
