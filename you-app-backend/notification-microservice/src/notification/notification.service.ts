import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RethrowGeneralError,
  throwCustomError,
} from '@shared/utilities/general-functions';
import {
  Notification,
  NotificationDocument,
} from 'src/schema/notification.schema';
import { HeaderData, SystemNotification } from '@shared/types/index';
import { formatDistanceToNow } from 'date-fns';
import { DeleteUserDto } from '@shared/dtos/delete-account.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async createNotification(data: SystemNotification) {
    const { receiver, sender } = data;

    // Check if there is an existing 'CONNECTION' notification where either the sender or receiver has already sent an invitation
    const existingNotification = await this.notificationModel.findOne({
      $or: [
        { receiver, sender, type: 'CONNECTION' }, // Sender has sent to receiver
        { receiver: sender, sender: receiver, type: 'CONNECTION' }, // Receiver has sent to sender
      ],
    });

    if (existingNotification) {
      return;
    }

    // Create the notification if no existing one found
    const notification = await this.notificationModel.create(data);
    return notification;
  }

  async findUserSentInvitations(userId: string) {
    return this.notificationModel.find({
      sender: userId,
      type: 'CONNECTION',
    });
  }

  async fetchNotifications({ userId }: HeaderData) {
    try {
      // Fetch notifications where the receiver is the specified user
      const notifications = await this.notificationModel
        .find({ receiver: userId, isRead: false })
        .sort({ createdAt: -1 })
        .select('_id sender type createdAt')
        .lean() // Use lean() to get plain JavaScript objects
        .exec();

      if (!notifications || notifications.length === 0) {
        return [];
      }

      // Fetch profile images for each sender in parallel
      const profileImagePromises = notifications.map((notification) =>
        lastValueFrom(
          this.userClient.send({ cmd: 'get-profile-url' }, notification.sender),
        ),
      );

      const profileImages = await Promise.all(profileImagePromises);

      return notifications.map((notification, index) => ({
        ...notification,
        profileImage: profileImages[index] || null, // Add profileImage or set to null if not found
        createdAt: formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
        }),
      }));
    } catch (error) {
      throwCustomError(
        'Error fetching notifications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async respondToNotification(data: SystemNotification) {
    const { receiver, respondedWith } = data;

    console.log(data);

    try {
      if (respondedWith) {
        // Accept the invitation by marking it as read
        const notification = await this.notificationModel.findOneAndUpdate(
          {
            _id: receiver, // Use _id to match the notification document
            isRead: false,
          },
          {
            isRead: true,
          },
          { new: true },
        );

        if (!notification) {
          throwCustomError(
            'Invitation not found or already responded to.',
            HttpStatus.NOT_FOUND,
          );
        }

        return notification;
      } else {
        // Refuse the invitation by deleting the notification
        const result = await this.notificationModel.findOneAndDelete({
          _id: receiver, // Use _id to match the notification document
          isRead: false,
        });

        if (!result) {
          throwCustomError(
            'Invitation not found or already responded to.',
            HttpStatus.NOT_FOUND,
          );
        }

        return { message: 'Invitation refused and notification deleted.' };
      }
    } catch (error) {
      throwCustomError(
        'Error responding to invitation.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAcceptedConnections(userId: string) {
    const acceptedConnections = await this.notificationModel.find({
      type: 'CONNECTION',
      isRead: true,
      $or: [{ sender: userId }, { receiver: userId }],
    });

    return acceptedConnections;
  }

  async deleteAccount({ userId }: HeaderData, target: DeleteUserDto) {
    try {
      // Try to find and delete the notification
      const notification = await this.notificationModel.findOneAndDelete({
        $or: [
          { sender: userId, receiver: target.receiver },
          { sender: target.receiver, receiver: userId },
        ],
        type: 'CONNECTION',
      });

      if (!notification) {
        // Custom error if notification is not found
        throwCustomError('Notification not found or already deleted.', 404);
      }

      return { message: 'Notification deleted successfully.' };
    } catch (error) {
      // Handle any other unexpected errors
      RethrowGeneralError(error);
    }
  }
}
