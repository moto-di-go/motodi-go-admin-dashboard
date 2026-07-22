export type ProfileType = "PASSENGER" | "MOTOTAXI" | "TRANSPORTER" | "AGENCY" | "ADMIN";

export type ValidationStatus = "DRAFT" | "PENDING" | "VALIDATED" | "REJECTED" | "SUSPENDED";

export type Permission =
  | "PROFILE_READ"
  | "PROFILE_UPDATE"
  | "PROFILE_SWITCH"
  | "KYC_REVIEW_READ"
  | "KYC_DECIDE"
  | "MODERATION_READ"
  | "MODERATION_WRITE"
  | "OPERATIONS_READ"
  | "PRICING_READ"
  | "PRICING_WRITE"
  | "GIS_READ"
  | "GIS_WRITE"
  | "KPI_READ"
  | "AGENCY_FLEET_MANAGE"
  | "INTERCITY_ANNOUNCEMENT_WRITE"
  | "AGENCY_STATS_READ"
  | (string & {});

export interface ProfileTokenSummary {
  id: string;
  type: ProfileType;
  validationStatus: ValidationStatus;
  active: boolean;
}

export interface AuthTokenResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  sessionId: string;
  userId: string;
  phoneNumber: string;
  roles: ProfileType[];
  profiles: ProfileTokenSummary[];
  activeProfileId: string | null;
  activeProfileType: ProfileType | null;
  permissions: Permission[];
}

export interface AdminSession {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  sessionId: string;
  userId: string;
  phoneNumber: string;
  roles: ProfileType[];
  profiles: ProfileTokenSummary[];
  activeProfileId: string | null;
  activeProfileType: ProfileType | null;
  permissions: Permission[];
  deviceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProtectedRoute {
  href: string;
  label: string;
  eyebrow: string;
  requiredAnyPermissions?: Permission[];
  requiredActiveProfileType?: ProfileType;
  requireValidatedActiveProfile?: boolean;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface AdminAuthGateway {
  login: (request: {
    phoneNumber: string;
    password: string;
    deviceId: string;
  }) => Promise<AuthTokenResponse>;
  refresh: (request: { refreshToken: string; deviceId: string }) => Promise<AuthTokenResponse>;
  activateProfile: (profileId: string, accessToken: string) => Promise<void>;
  logout: (accessToken: string) => Promise<void>;
}
