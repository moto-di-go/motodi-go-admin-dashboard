import { apiRequest } from "./api-client";
import type {
  OpsAnnouncementPage,
  OpsBookingPage,
  OpsOverview,
  OpsPaymentPage,
  OpsProfilePage,
  OpsUserDetail,
  OpsUserPage
} from "../ops/types";

export function getOpsOverview(accessToken: string): Promise<OpsOverview> {
  return apiRequest<OpsOverview>("/admin/ops/overview", { accessToken });
}

export function listOpsUsers(
  accessToken: string,
  params: { status?: string; search?: string; page?: number; size?: number } = {}
): Promise<OpsUserPage> {
  return apiRequest<OpsUserPage>(`/admin/ops/users?${toQuery(params)}`, { accessToken });
}

export function getOpsUser(userId: string, accessToken: string): Promise<OpsUserDetail> {
  return apiRequest<OpsUserDetail>(`/admin/ops/users/${encodeURIComponent(userId)}`, { accessToken });
}

export function listOpsProfiles(
  accessToken: string,
  params: { status?: string; type?: string; search?: string; page?: number; size?: number } = {}
): Promise<OpsProfilePage> {
  return apiRequest<OpsProfilePage>(`/admin/ops/profiles?${toQuery(params)}`, { accessToken });
}

export function listOpsAnnouncements(
  accessToken: string,
  params: { status?: string; search?: string; page?: number; size?: number } = {}
): Promise<OpsAnnouncementPage> {
  return apiRequest<OpsAnnouncementPage>(`/admin/ops/announcements?${toQuery(params)}`, { accessToken });
}

export function listOpsBookings(
  accessToken: string,
  params: { status?: string; search?: string; page?: number; size?: number } = {}
): Promise<OpsBookingPage> {
  return apiRequest<OpsBookingPage>(`/admin/ops/bookings?${toQuery(params)}`, { accessToken });
}

export function listOpsPayments(
  accessToken: string,
  params: { status?: string; search?: string; page?: number; size?: number } = {}
): Promise<OpsPaymentPage> {
  return apiRequest<OpsPaymentPage>(`/admin/ops/payments?${toQuery(params)}`, { accessToken });
}

export type OpsExportResource = "users" | "profiles" | "announcements" | "bookings" | "payments";

export function opsExportPath(
  resource: OpsExportResource,
  params: Record<string, string | undefined> = {}
): string {
  const query = toQuery(params);
  return `/api/ops/${resource}/export.csv${query ? `?${query}` : ""}`;
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }
    search.set(key, String(value));
  }
  return search.toString();
}
