import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { HeaderData, SystemNotification } from '@shared/types/index';
import {
  RethrowGeneralError,
  throwCustomError,
} from '@shared/utilities/general-functions';
import { DeleteUserDto } from '@shared/dtos/delete-account.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user.invited')
  async handleUserInvitation(data: SystemNotification) {
    try {
      await this.notificationService.createNotification(data);
    } catch (error) {
      throwCustomError(error, error.statusCode);
    }
  }

  @EventPattern('user.respond')
  async handleRespondInvitation(data: SystemNotification) {
    // console.log(data);

    try {
      await this.notificationService.respondToNotification(data);
    } catch (error) {
      RethrowGeneralError(error);
    }
  }

  @MessagePattern({ cmd: 'get-user-sent-invitations' })
  async getUserSentInvitations(userId: string) {
    return this.notificationService.findUserSentInvitations(userId);
  }

  @MessagePattern({ cmd: 'get-invitations-notifications' })
  async getInvitationNotifications(headerData: HeaderData) {
    return this.notificationService.fetchNotifications(headerData);
  }

  @MessagePattern({ cmd: 'get-accepted-connections' })
  async getAcceptedConnections(userId: string) {
    return this.notificationService.getAcceptedConnections(userId);
  }
  @MessagePattern({ cmd: 'delete-notifications-user' })
  async deleteAllNotitification(data: {
    headerData: HeaderData;
    target: DeleteUserDto;
  }) {
    return this.notificationService.deleteAccount(data.headerData, data.target);
  }
}
