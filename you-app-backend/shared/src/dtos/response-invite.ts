import { IsBoolean } from "class-validator";
import { InviteUserDto } from "./user-invite.dto";

export class RespondToInviteUserDto extends InviteUserDto {
  @IsBoolean()
  respond: boolean;
}
