import { HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { throwCustomError } from '@shared/utilities/general-functions';

export class UserClientService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationServiceProxy: ClientProxy,
  ) {}

  async getAllRegisteredUser(userId: string) {
    try {
      const [users, sentInvitations] = await Promise.all([
        lastValueFrom(
          this.userClient.send({ cmd: 'get-registered-users' }, userId),
        ),
        lastValueFrom(
          this.notificationServiceProxy.send(
            { cmd: 'get-user-sent-invitations' },
            userId,
          ),
        ),
      ]);
      const invitedUserIds = new Set(
        sentInvitations.map((invite) => invite.receiver),
      );

      return users.map((user) => ({
        ...user,
        isInvited: invitedUserIds.has(user._id.toString()),
      }));
    } catch (error) {
      console.error('Error in UserClientService:', error);

      throwCustomError(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getConnectedUsers(userId: string) {
    try {
      const acceptedConnections = await lastValueFrom(
        this.notificationServiceProxy.send(
          { cmd: 'get-accepted-connections' },
          userId,
        ),
      );

      if (!acceptedConnections.length) {
        return [];
      }

      const connectedUserIds = acceptedConnections.map((conn) =>
        conn.sender === userId ? conn.receiver : conn.sender,
      );

      const connectedUsers = await lastValueFrom(
        this.userClient.send({ cmd: 'get-users-by-ids' }, connectedUserIds),
      );

      return connectedUsers.map((user) => ({
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        // Add any other needed user fields
      }));
    } catch (error) {
      console.error('Error in getConnectedUsers:', error);
      throwCustomError(
        'Failed to retrieve connected users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
