import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { chineseZodiacData, zodiacData } from "./constants";
import imageCompression from "browser-image-compression";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Axios Instance

export const getWesternZodiacSign = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${month}-${day}`;

  for (const zodiac of zodiacData) {
    if (
      (formattedDate >= zodiac.startDate && formattedDate <= zodiac.endDate) ||
      (zodiac.sign === "Capricorn" &&
        (formattedDate >= "12-22" || formattedDate <= "01-19"))
    ) {
      return zodiac.sign;
    }
  }
  return "Unknown";
};

export const getChineseZodiacSign = (date: Date): string => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    for (const zodiac of chineseZodiacData) {
      if (
        formattedDate >= zodiac.startDate &&
        formattedDate <= zodiac.endDate
      ) {
        return zodiac.animal;
      }
    }
  } catch (error) {
    console.error("Invalid date:", error);
    return "Unknown";
  }
  return "Unknown";
};

export function formatDateToISO(dateString: string): string {
  const date = new Date(dateString);
  const isoString = date.toISOString();
  return isoString;
}

export async function handleImageUpload(imageFile: File) {
  const options = {
    maxSizeMB: 4,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);

    return compressedFile;
  } catch (error) {
    console.log(error);
  }
}

export function formatDateAndCalculateAge(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  const today = new Date();
  let age = today.getUTCFullYear() - year;
  const monthDiff = today.getUTCMonth() - date.getUTCMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getUTCDate() < date.getUTCDate())
  ) {
    age--;
  }

  return {
    day,
    month,
    year,
    age,
  };
}
