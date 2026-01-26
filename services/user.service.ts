import { BASE_URL } from "@/constants";
import { ENDPOINTS } from "./config";

export const profileSetup = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  data: {
    bloodGroup: string;
    address: string;
    location: { lat: string; lon: string };
  }
) => {
  return fetcher(`${BASE_URL}${ENDPOINTS.USER_SETUP}`, {
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
  return fetcher(`${BASE_URL}${ENDPOINTS.USER_STATS}`, {
    method: "GET"
  });
};

export const logDonation = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>
) => {
  return fetcher(`${BASE_URL}${ENDPOINTS.USER_LOG_DONATION}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
};
