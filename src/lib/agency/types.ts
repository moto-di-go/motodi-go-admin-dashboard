export interface AgencyOverview {
  activeAnnouncements: number;
  reservationCount: number;
  averageFillRate: number | null;
  billingPlan: "STANDARD" | "PREMIUM" | string;
  billingPlanPriceFcfa: number;
  displayPriority: number;
  legalName: string | null;
  reservationsByStatus: Record<string, number>;
  periodStart: string;
  periodEnd: string;
}

export interface AgencyAnnouncementSummary {
  id: string;
  publisherProfileId: string;
  departureCity: string;
  destinationCity: string;
  departureDate: string | null;
  departureTime: string | null;
  priceFcfa: number;
  totalSeats: number;
  remainingSeats: number;
  status: string;
  createdAt: string;
}

export interface AgencyAnnouncementPage {
  announcements: AgencyAnnouncementSummary[];
  page: number;
  size: number;
  hasMore: boolean;
}

export interface AgencyBookingSummary {
  id: string;
  announcementId: string;
  passengerProfileId: string;
  status: string;
  seatsRequested: number;
  contactPhone: string | null;
  requestedAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  expiresAt: string | null;
}

export interface AgencyBookingPage {
  bookings: AgencyBookingSummary[];
  page: number;
  size: number;
  hasMore: boolean;
}

export const emptyAgencyOverview = (): AgencyOverview => ({
  activeAnnouncements: 0,
  reservationCount: 0,
  averageFillRate: null,
  billingPlan: "STANDARD",
  billingPlanPriceFcfa: 10_000,
  displayPriority: 0,
  legalName: null,
  reservationsByStatus: {},
  periodStart: "",
  periodEnd: ""
});
