import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HeaderData } from '@shared/types';
import { lastValueFrom } from 'rxjs';
import { DeleteUserDto } from '@shared/dtos/delete-account.dto';

@Injectable()
export class NotificationClientService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  async getUserSentInvitations(userId: string) {
    try {
      return await lastValueFrom(
        this.notificationClient.send(
          { cmd: 'get-user-sent-invitations' },
          userId,
        ),
      );
    } catch (error) {
      console.error('Error in NotificationClientService:', error);
      throw error;
    }
  }

  async deleteAllNotitfication(headerData: HeaderData, target: DeleteUserDto) {
    return lastValueFrom(
      this.notificationClient.send(
        { cmd: 'delete-notifications-user' },
        { headerData, target },
      ),
    );
  }
}
