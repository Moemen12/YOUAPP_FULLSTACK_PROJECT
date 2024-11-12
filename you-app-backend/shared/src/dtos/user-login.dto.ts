import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
  @IsEmail(
    {
      require_tld: true,
    },
    {
      message: "Invalid email format",
    }
  )
  email: string;

  @IsString()
  password: string;
}
