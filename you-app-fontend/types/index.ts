import { AxiosError } from "axios";

export type AuthParams = {
  username?: string;
  email: string;
  password: string;
  password_confirmation?: string;
};

export type FormType = "login" | "register";

export type InterestedIdea =
  | "Basketball"
  | "Football"
  | "Tennis"
  | "Cricket"
  | "Baseball"
  | "Swimming"
  | "Running"
  | "Cycling"
  | "Hiking"
  | "Gymnastics"
  | "Martial Arts"
  | "Rugby"
  | "Volleyball"
  | "Badminton"
  | "Golf"
  | "Surfing"
  | "Skiing"
  | "Snowboarding";

export type ErrorShape = {
  message: string;
  statusCode: number;
  error: string;
};

export type AuthResponse = {
  access_token: string;
};

export type ProfileData = {
  username: string;
  gender: "Female" | "Male";
  birthday: string;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  isUpdated: boolean;
  interestedIdeas: InterestedIdea[];
  profileImage: string;
};

export type SuccessRes = {
  message: string;
};

type AxiosErrorType = {
  response: {
    data: {
      message: string;
    };
  };
};
export type CombinedAxiosError = AxiosError & AxiosErrorType;

export type RegisteredUsers = {
  _id: string;
  username: string;
  imageUrl: string;
  isInvited: boolean;
  receiver: string;
};

type NotificationType = "MESSAGE" | "INVITATION";

export type ReceivedInvitation = {
  _id: string;
  createdAt: string;
  type: NotificationType;
  username: string;
  profileImage?: string;
};

export type FormLevel = {
  profileEdit: boolean;
  interestEdit: boolean;
};

export type InvitationInfo = {
  receiver: string;
  respond: boolean;
};

// websocket

export interface User {
  name: string;
  isTyping: boolean;
}

export type Message = {
  _id: string;
  content: string;
  isRead: boolean;
  time: string;
  senderId: string;
};

export type ChatMessages = {
  allMessages: Message[];
  profileImage: string | null;
  receiver: string;
};

export type ChatAction =
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_MESSAGE_TEXT"; payload: string }
  | { type: "SET_JOINED"; payload: boolean }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_TYPING_USERS"; payload: User[] };

type LastMessage = {
  content: string;
  isRead: boolean;
  time: string;
};

export type ConnectedUser = {
  _id: string;
  username: string;
  profileImage: string;
  lastMessage: LastMessage | null;
  unreadCount: number;
};
