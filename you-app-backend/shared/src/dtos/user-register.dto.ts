import {
  IsEmail,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterUserDto {
  @IsEmail(
    {
      require_tld: true,
    },
    {
      message: "Invalid email format",
    }
  )
  email: string;

  @MinLength(5, { message: "Username must be at least 5 characters long" })
  @MaxLength(15, { message: "Username must be at most 15 characters long" })
  @Matches(/^[a-z0-9]+$/, {
    message:
      "Username must only contain small alphabetic characters and numbers",
  })
  username: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 2,
      minNumbers: 2,
      minUppercase: 2,
      minSymbols: 1,
    },
    {
      message:
        "Password must be at least 8 characters long, contain at least 2 lowercase letters, 2 uppercase letters, 2 numbers, and 1 special symbol.",
    }
  )
  password: string;
}
