import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../../../notification-microservice/src/schema/notification.schema';
import {
  User,
  UserDocument,
} from '../../../user-microservice/src/schema/user.schema';
import {
  ChatMessage,
  ChatMessageDocument,
} from 'src/schema/chat-message.schema';
import { formatTime } from '@shared/utilities/general-functions';
import { ConnectedUser } from '@shared/types';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  async getConnectedUsers(userId: string): Promise<ConnectedUser[]> {
    try {
      // Find all accepted connection notifications for this user
      const acceptedConnections = await this.notificationModel.find({
        $or: [{ receiver: userId }, { sender: userId }],
        type: 'CONNECTION',
        isRead: true,
      });

      // Extract all user IDs that are connected with the current user
      const connectedUserIds = acceptedConnections.map((notification) =>
        notification.receiver === userId
          ? notification.sender
          : notification.receiver,
      );

      // Get the user details for all connected users
      const connectedUsers = await this.userModel.aggregate([
        {
          $match: {
            _id: {
              $in: connectedUserIds.map((id) => new Types.ObjectId(id)),
            },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            profileImage: '$profileImage.url',
          },
        },
      ]);

      // Get the last message for each connection
      const lastMessages = await Promise.all(
        connectedUsers.map(async (user) => {
          const lastMessage = await this.chatMessageModel
            .findOne({
              $or: [
                { senderId: new Types.ObjectId(userId), receiverId: user._id },
                { senderId: user._id, receiverId: new Types.ObjectId(userId) },
              ],
            })
            .sort({ createdAt: -1 })
            .limit(1);

          return lastMessage
            ? {
                content: lastMessage.content,
                isRead: lastMessage.isRead,
                time: formatTime(lastMessage.createdAt),
              }
            : null;
        }),
      );

      return connectedUsers.map((user, index) => ({
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        lastMessage: lastMessages[index],
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Error in getConnectedUsers:', error);
      throw error;
    }
  }

  async getUnreadMessageCounts(userId: string) {
    const unreadCounts = await this.chatMessageModel.aggregate([
      {
        $match: {
          receiverId: new Types.ObjectId(userId),
          isRead: false,
        },
      },
      {
        $group: {
          _id: '$senderId',
          count: { $sum: 1 },
        },
      },
    ]);

    return unreadCounts;
  }

  async getChatHistory(userId: string, receiverId: string) {
    try {
      const messages = await this.chatMessageModel
        .find({
          $or: [
            {
              senderId: new Types.ObjectId(userId),
              receiverId: new Types.ObjectId(receiverId),
            },
            {
              senderId: new Types.ObjectId(receiverId),
              receiverId: new Types.ObjectId(userId),
            },
          ],
        })
        .sort({ createdAt: 1 })
        .lean();

      // Fetch the receiver's profile image
      const receiverProfileImage = await this.userModel
        .findById(receiverId, 'profileImage') // Fetch only the profileImage field
        .lean();

      const profileImage = receiverProfileImage?.profileImage?.url ?? null;

      // Format messages
      const allMessages = messages.map((message) => ({
        _id: message._id,
        senderId: message.senderId,
        content: message.content,
        isRead: message.isRead,
        time: formatTime(message.createdAt),
      }));

      const receiver = await this.userModel
        .findById({ _id: new Types.ObjectId(receiverId) })
        .lean();
      return {
        allMessages,
        profileImage,
        ...{ receiver: receiver.username },
      };
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      throw error;
    }
  }

  async saveMessage(messageData: {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    isRead: boolean;
    senderUsername: string;
  }) {
    try {
      const savedMessage = await this.chatMessageModel.create(messageData);

      return {
        ...savedMessage.toObject(),
        time: formatTime(savedMessage.createdAt),
      };
    } catch (error) {
      console.error('Error in saveMessage:', error);
      throw error;
    }
  }
}
