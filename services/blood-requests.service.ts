import { BASE_URL } from "@/constants";
import { ENDPOINTS } from "./config";

export const createBloodRequest = <T>(
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  data: T
) => {
  return fetcher(`${BASE_URL}${ENDPOINTS.BLOOD_REQUEST}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
};
