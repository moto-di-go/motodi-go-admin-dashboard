export interface BmcTargets {
  monthlyActiveUsers: number;
  activeVerifiedDrivers: number;
  slaAvailabilityPercent: number;
}

export interface KpiSnapshot {
  id: string;
  periodStart: string;
  periodEnd: string;
  monthlyActiveUsers: number;
  activeVerifiedDrivers: number;
  reservationCount: number;
  reservationsByStatus: Record<string, number>;
  walletVolumeFcfa: number;
  mtnMomoVolumeFcfa: number;
  orangeMoneyVolumeFcfa: number;
  slaAvailability: number | null;
  avgSigSyncSeconds: number | null;
  aiUsageRate: number | null;
  bmcTargetsM6: BmcTargets;
  bmcTargetsM12: BmcTargets;
  createdAt: string;
}

export const emptyBmcTargets = (): BmcTargets => ({
  monthlyActiveUsers: 0,
  activeVerifiedDrivers: 0,
  slaAvailabilityPercent: 0
});

export const emptyKpiSnapshot = (): KpiSnapshot => ({
  id: "",
  periodStart: "",
  periodEnd: "",
  monthlyActiveUsers: 0,
  activeVerifiedDrivers: 0,
  reservationCount: 0,
  reservationsByStatus: {},
  walletVolumeFcfa: 0,
  mtnMomoVolumeFcfa: 0,
  orangeMoneyVolumeFcfa: 0,
  slaAvailability: null,
  avgSigSyncSeconds: null,
  aiUsageRate: null,
  bmcTargetsM6: emptyBmcTargets(),
  bmcTargetsM12: emptyBmcTargets(),
  createdAt: ""
});

/** Progress toward a BMC target, capped at 100%. */
export function progressTowardTarget(value: number | null | undefined, target: number): number {
  if (value === null || value === undefined || !Number.isFinite(value) || !Number.isFinite(target) || target <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, (value / target) * 100));
}

/** Display AI usage rate (0–1 ratio from API); null → "Non disponible". */
export function formatAiUsageRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined || Number.isNaN(Number(rate))) {
    return "Non disponible";
  }
  const percent = Number(rate) <= 1 ? Number(rate) * 100 : Number(rate);
  return `${new Intl.NumberFormat("fr-CM", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(percent)}%`;
}

export function formatNullablePercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Non disponible";
  }
  return `${new Intl.NumberFormat("fr-CM", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(Number(value))}%`;
}

export function formatNullableSeconds(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Non disponible";
  }
  return `${new Intl.NumberFormat("fr-CM", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(Number(value))} s`;
}
