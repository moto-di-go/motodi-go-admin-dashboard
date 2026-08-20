import { apiRequest } from "./api-client";

export interface PricingRule {
  id: string;
  zoneCode: string;
  zoneGeoJson?: string | null;
  timeStart: string;
  timeEnd: string;
  baseFare: number;
  pricePerKm: number;
  nightCoefficient: number;
  weatherCoefficient: number;
  active: boolean;
}

export interface TrafficLayer {
  id: string;
  type: string;
  label: string;
  geometryWkt: string;
  geoJson?: string | null;
  severity: string;
  validFrom?: string;
  validTo?: string | null;
  active: boolean;
  source?: string | null;
}

export function listPricingRules(accessToken: string): Promise<PricingRule[]> {
  return apiRequest<PricingRule[]>("/admin/pricing/rules", { accessToken });
}

export function createPricingRule(body: Record<string, unknown>, accessToken: string): Promise<PricingRule> {
  return apiRequest<PricingRule>("/admin/pricing/rules", {
    method: "POST",
    body,
    accessToken
  });
}

export function listGisLayers(accessToken: string): Promise<TrafficLayer[]> {
  return apiRequest<TrafficLayer[]>("/admin/gis/layers", { accessToken });
}

export function createGisLayer(body: Record<string, unknown>, accessToken: string): Promise<TrafficLayer> {
  return apiRequest<TrafficLayer>("/admin/gis/layers", {
    method: "POST",
    body,
    accessToken
  });
}
