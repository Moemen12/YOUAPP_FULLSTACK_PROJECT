import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@shared/decorators/user.decorator';
import { HeaderData } from '@shared/types';
import { AuthGuard } from 'src/guards/auth.guard';
import { InviteUserDto } from '@shared/dtos/user-invite.dto';
import { throwCustomError } from '@shared/utilities/general-functions';
import { lastValueFrom } from 'rxjs';
import { RespondToInviteUserDto } from '@shared/dtos/response-invite';
@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  @Post('invite')
  async inviteUser(
    @User() headerData: HeaderData,
    @Body() { receiver }: InviteUserDto,
  ) {
    try {
      this.notificationClient.emit('user.invited', {
        receiver: receiver,
        sender: headerData.userId,
        type: 'CONNECTION',
      });
      return { message: 'Invitation sent successfully' };
    } catch (error) {
      throwCustomError('Failed to send invitation', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get-invitations')
  async getInvitationNotifications(@User() headerData: HeaderData) {
    return lastValueFrom(
      this.notificationClient.send(
        { cmd: 'get-invitations-notifications' },
        headerData,
      ),
    );
  }

  @Patch('/invitations/respond')
  async respondToInvitation(
    @User() { userId }: HeaderData,
    @Body() respondData: RespondToInviteUserDto,
  ) {
    try {
      this.notificationClient.emit('user.respond', {
        receiver: respondData.receiver,
        sender: userId,
        type: 'CONNECTION',
        respondedWith: respondData.respond,
      });
      // return { message: 'Invitation sent successfully' };
    } catch (error) {
      throwCustomError('Failed to send invitation', HttpStatus.BAD_REQUEST);
    }
  }
}
