import { apiRequest } from "./api-client";

export interface PhotonIndexStatus {
  enabled: boolean;
  ready: boolean;
  updating: boolean;
  manualUpdateAvailable: boolean;
  message: string;
}

export function getPhotonIndexStatus(accessToken: string): Promise<PhotonIndexStatus> {
  return apiRequest<PhotonIndexStatus>("/admin/gis/photon", { accessToken });
}

export function startPhotonIndexUpdate(accessToken: string): Promise<PhotonIndexStatus> {
  return apiRequest<PhotonIndexStatus>("/admin/gis/photon/update", {
    method: "POST",
    accessToken,
    timeoutMs: 15000
  });
}
