import { SafeMongoIdTransform } from "@shared/utilities/general-functions";
import { Transform } from "class-transformer";
import { IsMongoId, IsString } from "class-validator";

export class InviteUserDto {
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  receiver: string;
}
