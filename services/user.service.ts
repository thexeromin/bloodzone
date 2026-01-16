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
