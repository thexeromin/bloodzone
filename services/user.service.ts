import { API } from "@/constants";
import { ENDPOINTS } from "./config";

export const profileSetup = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  data: {
    bloodGroup: string;
    address: string;
    location: { lat: string; lon: string };
  }
) => {
  return fetcher(`${API}${ENDPOINTS.USER_SETUP}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
};

export const getUserStats = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>
) => {
  return fetcher(`${API}${ENDPOINTS.USER_STATS}`, {
    method: "GET"
  });
};

export const logDonation = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>
) => {
  return fetcher(`${API}${ENDPOINTS.USER_LOG_DONATION}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const findDonors = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  params?: URLSearchParams | string
) => {
  const queryString = params ? `?${params.toString()}` : "";

  return fetcher(`${API}${ENDPOINTS.FIND_DONORS}${queryString}`, {
    method: "GET"
  });
};
