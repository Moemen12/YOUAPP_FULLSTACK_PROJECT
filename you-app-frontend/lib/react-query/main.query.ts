import { axiosInstance } from "../axios/axios-instance";

// fetch Profile data

export const fetchProfile = async () => {
  const response = await axiosInstance.get(`/profile`);
  return response.data;
};

export const getInvitationNotifications = async () => {
  const response = await axiosInstance.get("/notification/get-invitations");
  return response.data;
};

export const fetchAllUsersChat = async () => {
  const response = await axiosInstance.get("/chat/view-chats");
  return response.data;
};

export const fetchUserByUsername = async (receiverId: string) => {
  const response = await axiosInstance.get(`/chat/${receiverId}`);
  return response.data;
};
