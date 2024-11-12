import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { HeaderData } from '@shared/types';
import { UserClientService } from 'src/clients/user-client.service';
import { ChatMessage } from 'src/schema/chat-message.schema';
import { Model, Types } from 'mongoose';
import { NotificationClientService } from 'src/clients/notification-client.service';
import { DeleteUserDto } from '@shared/dtos/delete-account.dto';
import {
  RethrowGeneralError,
  throwCustomError,
} from '@shared/utilities/general-functions';
@Injectable()
export class ChatService {
  constructor(
    private readonly userClientService: UserClientService,
    private readonly notificationClientService: NotificationClientService,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  async getAllRegisteredUser(headerData: HeaderData) {
    return await this.userClientService.getAllRegisteredUser(headerData.userId);
  }

  async getConnectedUsers(headerData: HeaderData) {
    return await this.userClientService.getConnectedUsers(headerData.userId);
  }

  async saveMessage(messageData: {
    senderId: string;
    receiverId: string;
    content: string;
    senderUsername: string;
  }) {
    return await this.chatMessageModel.create(messageData);
  }

  async getMessages(user1Id: string, user2Id: string) {
    return await this.chatMessageModel
      .find({
        $or: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      })
      .sort({ createdAt: 1 });
  }

  async deleteAllChats(headerData: HeaderData, target: DeleteUserDto) {
    try {
      const targetId = new Types.ObjectId(target.receiver);
      const userId = new Types.ObjectId(headerData.userId);

      const result = await this.chatMessageModel.deleteMany({
        $or: [
          { senderId: targetId, receiverId: userId },
          { senderId: userId, receiverId: targetId },
        ],
      });

      if (result.deletedCount === 0) {
        return { message: 'No chats found to delete.' }; // Just return a message instead of throwing an error
      }

      return { message: 'Chats deleted successfully.' };
    } catch (error) {
      RethrowGeneralError(error); // General error handling for other unexpected issues
    }
  }

  // Modify deleteAllNotifications method
  async deleteAllNotifications(headerData: HeaderData, target: DeleteUserDto) {
    try {
      const notification =
        await this.notificationClientService.deleteAllNotitfication(
          headerData,
          target,
        );

      if (!notification) {
        return { message: 'No notifications found to delete.' }; // Just return a message instead of throwing an error
      }

      return { message: 'Notifications deleted successfully.' };
    } catch (error) {
      RethrowGeneralError(error); // General error handling for other unexpected issues
    }
  }

  async clearUserChat({ userId }: HeaderData, target: DeleteUserDto) {
    try {
      const targetId = new Types.ObjectId(target.receiver);
      const userObjectId = new Types.ObjectId(userId);

      const result = await this.chatMessageModel.deleteMany({
        $or: [
          { senderId: targetId, receiverId: userObjectId },
          { senderId: userObjectId, receiverId: targetId },
        ],
      });

      // Check if any messages were deleted
      if (result.deletedCount === 0) {
        return { message: 'No chats found for this user to delete.' };
      }

      return { message: 'User chats cleared successfully.' };
    } catch (error) {
      // General error handling
      RethrowGeneralError(error);
    }
  }
}
