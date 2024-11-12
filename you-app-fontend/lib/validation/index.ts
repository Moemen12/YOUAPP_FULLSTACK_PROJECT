import { z } from "zod";
import { getWesternZodiacSign } from "../utils";

// Define the custom validation for profile images
const imageValidationSchema = z.custom<File>(
  (file) => {
    if (!(file instanceof File)) return false;

    const validTypes = ["image/jpeg", "image/png"];
    const isValidType = validTypes.includes(file.type);

    const maxSizeInMB = 5;
    const isValidSize = file.size <= maxSizeInMB * 1024 * 1024;

    return isValidType && isValidSize;
  },
  {
    message: "Image must be a jpeg/png and less than 5MB",
  }
);

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(5, "Username must be at least 5 characters long")
      .max(15, "Username must be at most 15 characters long")
      .regex(/^[A-Za-z0-9]+$/, {
        message: "Username must only contain alphabetic characters and numbers",
      }),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (value) =>
          /[a-z]/.test(value) &&
          /[A-Z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value),
        {
          message:
            "Password must contain at least 2 lowercase, 2 uppercase letters, 2 numbers, and 1 special character.",
        }
      ),
    password_confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const ProfileSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(15, "Username must be at most 15 characters long")
    .regex(/^[A-Za-z0-9]+$/, {
      message: "Username must only contain alphabetic characters and numbers",
    }),
  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Genre is required" }),
  }),
  birthday: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Birthday must be a valid date",
    })
    .refine(
      (value) => {
        if (value) {
          const date = new Date(value);
          return getWesternZodiacSign(date) !== null;
        }
        return true;
      },
      { message: "Birthday must correspond to a valid zodiac sign" }
    ),
  zodiac: z.string().min(1, "Zodiac sign is required"),
  horoscope: z.string().min(1, "Horoscope is required"),
  height: z
    .number({ message: "Height is required" })
    .min(50, "Height must be at least 50 cm")
    .max(250, "Height can't exceed 250 cm"),
  weight: z
    .number({ message: "Weight is required" })
    .min(20, "Weight must be at least 20 kg")
    .max(300, "Weight can't exceed 300 kg"),
  profile_image: imageValidationSchema,
  interestedIdeas: z.any(),
});

export type ProfileParams = z.infer<typeof ProfileSchema>;
export type RegisterParams = z.infer<typeof RegisterSchema>;
export type LoginParams = z.infer<typeof LoginSchema>;
