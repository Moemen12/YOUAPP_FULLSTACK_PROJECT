import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from 'src/schema/chat-message.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  Notification,
  NotificationSchema,
} from '../../../notification-microservice/src/schema/notification.schema';
import {
  User,
  UserSchema,
} from '../../../user-microservice/src/schema/user.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SOCKET_TOKEN'),
      }),
    }),
    MongooseModule.forFeature([
      {
        //TODO  update this to dont inject notification model direcly here
        name: User.name,
        schema: UserSchema,
      },
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
      {
        //TODO  update this to dont inject notification model direcly here
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
