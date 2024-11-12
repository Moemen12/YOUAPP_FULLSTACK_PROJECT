import { Controller, Delete } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { HeaderData } from '@shared/types';
import { ChatService } from './chat.service';
import { from, lastValueFrom } from 'rxjs';
import { DeleteUserDto } from '@shared/dtos/delete-account.dto';
import { RethrowGeneralError } from '@shared/utilities/general-functions';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @MessagePattern({ cmd: 'get-all-users' })
  async getAllRegisteredUser(headerData: HeaderData) {
    return await this.chatService.getAllRegisteredUser(headerData);
  }

  @MessagePattern({ cmd: 'view-connected-users' })
  async getConnectedUsers(headerData: HeaderData) {
    return await this.chatService.getConnectedUsers(headerData);
  }

  @MessagePattern({ cmd: 'get_messages' })
  async getMessagesWith(data: { senderId: string; receiverId: string }) {
    return await this.chatService.getMessages(data.senderId, data.receiverId);
  }
  @MessagePattern({ cmd: 'delete-account' })
  async deleteAllChats(data: {
    headerData: HeaderData;
    target: DeleteUserDto;
  }) {
    try {
      const [chatsResult, notificationsResult] = await Promise.all([
        lastValueFrom(
          from(this.chatService.deleteAllChats(data.headerData, data.target)),
        ),
        lastValueFrom(
          from(
            this.chatService.deleteAllNotifications(
              data.headerData,
              data.target,
            ),
          ),
        ),
      ]);

      // Check the result messages for chats and notifications
      return {
        message: 'Account, chats, and notifications deleted successfully.',
        chatsResult: chatsResult.message, // Message will contain 'No chats found to delete' or 'Chats deleted successfully'
        notificationsResult: notificationsResult.message, // Same for notifications
      };
    } catch (error) {
      if (
        error.message === 'No chats found to delete.' ||
        error.message === 'No notifications found to delete.'
      ) {
        return {
          message:
            'Account deletion completed with no chats or notifications to delete.',
        };
      } else {
        RethrowGeneralError(error); // General error handling for unexpected errors
      }
    }
  }

  @MessagePattern({ cmd: 'clear-chat-account' })
  async clearUserChat(data: { headerData: HeaderData; target: DeleteUserDto }) {
    return await this.chatService.clearUserChat(data.headerData, data.target);
  }
}
