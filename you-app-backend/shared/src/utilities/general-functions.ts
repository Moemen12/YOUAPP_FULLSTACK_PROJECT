import { HttpStatus, ValidationError } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import * as bcrypt from "bcryptjs";
import { Types } from "mongoose";
// import { MemoryStoredFile } from 'nestjs-form-data';

// ## Return Error in a specific structure

export function formatValidationErrors(errors: ValidationError[]) {
  const firstError = errors[0];

  let errorMessage = "";
  if (firstError && firstError.constraints) {
    errorMessage = Object.values(firstError.constraints)[0] || "";
  }

  return {
    message: errorMessage,
    error: "Validation Error",
    statusCode: 400,
  };
}
// ## used in Catch Block For Unexpected Error

export function RethrowGeneralError(error: Error) {
  throw new RpcException({
    message: "An error occurred",
    statusCode: 500,
    error: error ? error.message : "An error occurred",
  });
}
// ## Return specific Error (For user)

export function throwCustomError(message: string, status: number) {
  throw new RpcException({
    message,
    status,
    error: message,
  });
}

export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
  } catch (error) {
    RethrowGeneralError(error);
  }
}

export const SafeMongoIdTransform = ({ value }) => {
  try {
    if (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    ) {
      return value;
    }
    throwCustomError("Id validation fail", HttpStatus.BAD_REQUEST);
  } catch (error) {
    throwCustomError("Id validation fail", HttpStatus.BAD_REQUEST);
  }
};

export function formatTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Display as hh:mm if within 24 hours
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 48 && now.getDate() - date.getDate() === 1) {
    // Display as "Yesterday" if it was yesterday
    return "Yesterday";
  } else {
    // Display as dd/mm/yyyy for older dates
    return date.toLocaleDateString("en-GB");
  }
}
