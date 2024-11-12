import { InvitationInfo } from "@/types";
import { axiosInstance } from "../axios/axios-instance";

// update Profile data

export const updateProfile = async (formData: FormData) => {
  const response = await axiosInstance.put(`/profile`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get registered user

export const getRegisteredUsers = async () => {
  const response = await axiosInstance.get(`/get-registered-user`, {
    withCredentials: true,
  });
  return response.data;
};

// Invite user

export const inviteUser = async (receiver: string) => {
  const response = await axiosInstance.post(
    "/notification/invite",
    {
      receiver,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

// Respond to invitation

export const respondToUserInvitation = async ({
  receiver,
  respond,
}: InvitationInfo) => {
  const response = await axiosInstance.patch(
    "/notification/invitations/respond",
    {
      receiver,
      respond,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const deleteUser = async (receiver: string) => {
  const response = await axiosInstance.delete("/delete-account", {
    data: { receiver },
    withCredentials: true,
  });

  return response.data;
};

export const clearChat = async (receiver: string) => {
  const response = await axiosInstance.delete("/clear-chat", {
    data: { receiver },
    withCredentials: true,
  });

  return response.data;
};
