import { MemoryStoredFile } from "nestjs-form-data";
import { HoroscopeSign, Zodiac } from "../constants";

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

export type ProfileData = {
  username: string;
  interestedIdeas: string[];
  gender: "Female" | "Male";
  birthday: string;
  horoscope: HoroscopeSign;
  zodiac: Zodiac;
  height: number;
  weight: number;
  profile_image: MemoryStoredFile;
};

export type HeaderData = {
  userId: string;
  username: string;
  iat: number;
  exp: number;
};

export type SuccessRes = {
  message: string;
};

export type ErrorShape = {
  message: string;
  error: string;
  statusCode: string;
};

type NotificationType = "MESSAGE" | "CONNECTION";

export type SystemNotification = {
  receiver: string;
  sender: string;
  type: NotificationType;
  respondedWith?: boolean;
};

type LastMessage = {
  content: string;
  isRead: boolean;
  time: string;
};
export type ConnectedUser = {
  _id: string;
  username: string;
  profileImage: string | null;
  lastMessage: LastMessage | null;
  unreadCount: number;
};
