import { apiRequest } from "./api-client";
import type { AgencyAnnouncementPage, AgencyBookingPage, AgencyOverview } from "../agency/types";

export function getAgencyOverview(
  accessToken: string,
  params: { from?: string; to?: string } = {}
): Promise<AgencyOverview> {
  return apiRequest<AgencyOverview>(`/agency/overview?${toQuery(params)}`, { accessToken });
}

export function listAgencyAnnouncements(
  accessToken: string,
  params: { status?: string; page?: number; size?: number } = {}
): Promise<AgencyAnnouncementPage> {
  return apiRequest<AgencyAnnouncementPage>(`/agency/announcements?${toQuery(params)}`, { accessToken });
}

export function listAgencyBookings(
  accessToken: string,
  params: { status?: string; page?: number; size?: number } = {}
): Promise<AgencyBookingPage> {
  return apiRequest<AgencyBookingPage>(`/agency/bookings?${toQuery(params)}`, { accessToken });
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
