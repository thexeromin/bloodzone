import { API } from "@/constants";
import { ENDPOINTS } from "./config";

export const initiateChat = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  data: {
    targetUserId: string; // request owner
  }
) => {
  return fetcher(`${API}${ENDPOINTS.INITIATE_CHAT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
};

export const getMyChats = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>
) => {
  return fetcher(`${API}${ENDPOINTS.GET_MY_CHATS}`, {
    method: "GET"
  });
};

export const getMessages = (
  fetcher: (url: string, options: RequestInit) => Promise<Response>,
  roomId: string
) => {
  return fetcher(`${API}${ENDPOINTS.GET_MESSAGES}${roomId}/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
};
