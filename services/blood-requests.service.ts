import { BASE_URL } from "@/constants";
import { ENDPOINTS } from "./config";

export const createBloodRequest = <T>(
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  data: T
) => {
  return fetcher(`${BASE_URL}${ENDPOINTS.BLOOD_REQUESTS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
};

export const getBloodRequests = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  params: URLSearchParams
) => {
  return fetcher(
    `${BASE_URL}${ENDPOINTS.BLOOD_REQUESTS}?${params.toString()}`,
    {
      method: "GET"
    }
  );
};

export const getMyRequests = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>
) => {
  return fetcher(`${BASE_URL}${ENDPOINTS.MY_REQUESTS}`, {
    method: "GET"
  });
};

export const deleteRequest = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  requestId: string
) => {
  return fetcher(`${BASE_URL}${ENDPOINTS.BLOOD_REQUESTS}${requestId}`, {
    method: "DELETE"
  });
};

export const updateRequestStatus = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  requestId: string,
  status: "active" | "fulfilled"
) => {
  return fetcher(`${BASE_URL}${ENDPOINTS.BLOOD_REQUESTS}${requestId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });
};
