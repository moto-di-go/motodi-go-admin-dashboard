export interface OpsOverview {
  usersTotal: number;
  usersByStatus: Record<string, number>;
  announcementsActive: number;
  announcementsByStatus: Record<string, number>;
  bookingsByStatus: Record<string, number>;
  paymentsPendingToday: number;
  paymentsConfirmedToday: number;
  paymentsNote?: string;
}

export interface OpsUserSummary {
  id: string;
  phoneNumber: string | null;
  fullName: string | null;
  email: string | null;
  status: string;
  createdAt: string;
  profilesCount: number;
}

export interface OpsUserPage {
  users: OpsUserSummary[];
  page: number;
  size: number;
  hasMore: boolean;
}

export interface OpsProfileSummary {
  id: string;
  type: string;
  validationStatus: string;
  displayName: string | null;
  active: boolean;
  createdAt: string;
}

export interface OpsUserDetail {
  id: string;
  phoneNumber: string | null;
  fullName: string | null;
  email: string | null;
  locale: string | null;
  status: string;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profiles: OpsProfileSummary[];
}

export interface OpsProfileListItem {
  id: string;
  userId: string;
  type: string;
  validationStatus: string;
  displayName: string | null;
  active: boolean;
  createdAt: string;
  userPhone: string | null;
  userStatus: string;
}

export interface OpsProfilePage {
  profiles: OpsProfileListItem[];
  page: number;
  size: number;
  hasMore: boolean;
}

export interface OpsAnnouncementSummary {
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

export interface OpsAnnouncementPage {
  announcements: OpsAnnouncementSummary[];
  page: number;
  size: number;
  hasMore: boolean;
}

export interface OpsBookingSummary {
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

export interface OpsBookingPage {
  bookings: OpsBookingSummary[];
  page: number;
  size: number;
  hasMore: boolean;
}

export interface OpsPaymentSummary {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  provider: string | null;
  payerPhone: string | null;
  externalReference: string | null;
  initiatedAt: string;
  confirmedAt: string | null;
}

export interface OpsPaymentPage {
  payments: OpsPaymentSummary[];
  page: number;
  size: number;
  hasMore: boolean;
  reconciliationEndpoint: string;
}

export const emptyOpsOverview = (): OpsOverview => ({
  usersTotal: 0,
  usersByStatus: {},
  announcementsActive: 0,
  announcementsByStatus: {},
  bookingsByStatus: {},
  paymentsPendingToday: 0,
  paymentsConfirmedToday: 0,
  paymentsNote: undefined
});
